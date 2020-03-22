const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const ftp = require('basic-ftp');
const config = require('./config.js');
const FileHound = require('filehound');
require('dotenv').config();

async function findLocalAndDownload(fileName, client) {
	const match = fileName.match(/([^\.]+)\./);
	if (match) {
		const trackName = match[1];
		const files = await FileHound.create()
			.paths(config.paths.src.music)
			.glob(`${trackName}.js`)
			.find();
		if (files.length) {
			const filePath = files[0];
			const fileDir = path.dirname(filePath);
			const mp3FilePath = path.join(fileDir, `${trackName}.mp3`);
			const writeStream = fs.createWriteStream(mp3FilePath);
			console.log(fileName);
			await client.download(writeStream, fileName);
		}
	}
}

// Скачать mp3-файлы композиций с сервера
gulp.task('download-mp3', async function downloadMp3() {
	const client = new ftp.Client();
	try {
		await client.access({
			...config.ftp,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASSWORD
		});
		await client.cd('music');
		const mp3list = (await client.list())
			.map((fileInfo) => fileInfo.name)
			.filter((fileName) => /\.mp3$/.test(fileName));
		for (let index = 0; index < mp3list.length; index++) {
			await findLocalAndDownload(mp3list[index], client);
		}
	} catch (err) {
		console.error(err);
	} finally {
		client.close();
	}
});

gulp.task('deploy', gulp.series('build', async function deploy() {
	const client = new ftp.Client();
	try {
		await client.access({
			...config.ftp,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASSWORD
		});
		await client.uploadDir(config.paths.dist.js);
	} catch (err) {
		console.error(err);
	} finally {
		client.close();
	}
}));

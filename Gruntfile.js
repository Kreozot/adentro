module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		secret: grunt.file.readJSON('secret.json'),
		environments: {
			production: {
				options: {
					host: '<%= secret.ssh.host %>',
					username: '<%= secret.ssh.username %>',
					password: '<%= secret.ssh.password %>',
					port: '<%= secret.ssh.port %>',
					deploy_path: '/public_html',
					local_path: 'build/',
					current_symlink: 'current',
					debug: true
				}
			}
		},
		uglify: {
			build: {
				files: {
					'build/js/animation.min.js': [
						'js/animations/animation.js',
						'js/animations/animation4.js',
						'js/animations/animation_gato_style.js',
						'js/animations/gato.js',
						'js/animations/bailecito.js',
						'js/animations/chacarera.js',
						'js/animations/chacarera4.js',
						'js/animations/escondido.js',
						'js/animations/remedio.js',
						'js/animations/zamba.js',
						'js/animations/huayra_muyoj.js'
					],
					'build/js/script.min.js' : [
						'js/jquery-classes.js',
						'js/script.js',
						'js/timing.js',
						'js/timing-generator.js',
						'js/navigation.js',
						'js/player.js',
						'js/tour.js'
					]
				}
			}
		},
		concat: {
			build: {
				files: {
					'build/js/thirdparty/thirdparty.min.js': [
						'js/thirdparty/jquery-2.1.3.min.js',
						'js/thirdparty/i18next-1.7.5.min.js',
						'js/thirdparty/jquery.jplayer.min.js',
						'js/thirdparty/jquery.cookie.js',
						'js/thirdparty/snap.svg-min.js',
						'js/thirdparty/URI.min.js',
						'js/thirdparty/hopscotch.min.js'
					]
				}
			}
		},
		cssmin: {
			build: {
				files: {
					'build/css/min.css': [
						'css/jplayer.blue.monday.css',
						'css/animation.css',
						'css/danceschema.css',
						'css/hopscotch.css',
						'css/menu.css'
					]
				}
			}
		},
		xmlmin: {
			build: {
				files: [
	      			{expand: true, src: ['svg/*.xsl'], dest: 'build/'},
	      			{expand: true, src: ['svg/*.svg'], dest: 'build/'}
				]
			}
		},
		compress: {
			build: {
				options: {
					mode: 'deflate'
				},
				files: [
      				{expand: true, src: ['build/js/**/*.min.js'], dest: './', ext: '.min.js.gz'},
      				{expand: true, src: ['build/css/*.css'], dest: './', ext: '.css.gz'},
				]
			}
		},
		processhtml: {
			build: {
				options: {
					data: {
						version: '<%= pkg.version %>'
					}
				},
				files: {
					'build/index.html': 'index.html'
				}
			}
		},
		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: false,
					minifyJS: true
				},
				files: [
					{'build/index.html': 'build/index.html'},
					{expand: true, src: 'info/*.inc', dest: 'build/'}
				]
			}
		},
		sox: {
			convertmp3: {
				src: 'music/*/*.mp3'
			}
		},
		msxsl: {
			build: {
				files: {expand: true, src: ['svg/*.svg'], dest: 'svg/compiled/'},
				schema: 'svg/schema.xsl'
			}
		},
		clean: {
			build: {
				src: [
					'build/*',
					'!build/music'
				]
			},
			convertmp3: {
				src: 'build/music/**/*'
			}
		},
		copy: {
			build: {
				files: [
					{
						src: [
							'img/**/*',
							'svg/compiled/**/*',
							'locales/**/*',
							'js/thirdparty/*.swf',
							'js/thirdparty/history.js',
							'js/thirdparty/history.html4.js',
							'js/thirdparty/history.adapter.jquery.js'
						],
						dest: 'build/'
					},
					{
						expand: true,
						flatten: true,
						src: ['favicons/**'],
						dest: 'build/',
						filter: 'isFile'
					}
				]
			},
			//Копирование структуры директорий в папке с музыкой
			convertmp3: {
				files: [
					{
						expand: true,
						src: 'music/**/*',
						dest: 'build/',
						filter: 'isDirectory'
					}
				]
			}
		},
		'ftp-deploy': {
			production: {
				auth: {
					host: '<%= secret.ftp.host %>',
					port: '<%= secret.ftp.port %>',
					authPath: 'secret.json',
					authKey: 'ftpkey'
				},
				src: 'build/',
				dest: '/'
			}
		},
		jsdoc: {
			build: {
				src: ['js/*.js'],
				options: {
					destination: 'docs'
				}
			}
		},
		mkdir: {
			svg: {
				options: {
					create: ['svg/compiled']
				}
			}
		}
	});

	/**
	 * Функция для задач обработки файлов с помощью сторонних утилит
	 * @param  {Function} getCommandLine Функция для получения строки комманды (аргумент - путь к файлу)
	 */
	function processFilesWithTool(getCommandLine) {
		grunt.log.writeln('Processing started...');
		var exec = require('child_process').exec;
		var done = this.async();

		var i = 0;
		var fileList = grunt.file.expand(this.data.files, this.data.files.src);
		grunt.log.writeln('Processing ' + fileList.length + ' files.');
		fileList.forEach(function(file) {
			exec(getCommandLine(file),
				function(error, stdout, stderr) {
					if (stdout && (stdout.length > 0)) {
						grunt.log.writeln('stdout: ' + stdout);
					}
					if (stderr && (stderr.length > 0)) {
						grunt.log.writeln('stderr: ' + stderr);
					}	
					if (error !== null) {
						grunt.log.writeln('exec error: ' + error);
					}
					i++;
					grunt.log.write('+');
					if (i >= fileList.length) {
						done(error);
					}
				}
			);
		});
	}

	grunt.registerMultiTask('sox', 'Convert MP3 files to WAV using SOX', function() {
		processFilesWithTool.call(this, function(f) {
			return '"./tools/sox.exe" ' + f + ' build/' + f;
		});		
	});

	grunt.registerMultiTask('msxsl', 'Convert XML files with XSL stylesheet using MSXSL', function() {
		var schema = this.data.schema;
		var outputFolder = this.data.files.dest;
		processFilesWithTool.call(this, function(f) {
			var fileName = f.split("/").pop();
			return '"./tools/msxsl.exe" ' + f + ' ' + schema + ' -o ' + outputFolder + fileName;
		});
	});

	grunt.registerTask('compileSvg', [
		'mkdir:svg',
		'msxsl'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'compileSvg',
		'uglify:build', 
		'cssmin:build',
		'xmlmin:build',
		'processhtml:build',
		'htmlmin:build',
		'concat:build',
		'copy:build'
	]);
	grunt.registerTask('convertmp3', [
		'clean:convertmp3',
		'copy:convertmp3',
		'sox:convertmp3'
	]);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('deploy', ['ftp-deploy:production']);
	grunt.registerTask('docs', ['jsdoc:build']);

	grunt.registerTask('test', ['build']);
};
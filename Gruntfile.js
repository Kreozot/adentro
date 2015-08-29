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
						'js/loading/animation_loading.js',
						'js/loading/content_switch.js',
						'js/loading/info_loading.js',
						// 'js/loading/zapateo_loading.js',
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
		// sox: {
		// 	musicConvert: {
		// 		files: {expand: true, src: ['music/*/*.mp3'], dest: 'build/'}
		// 	}
		// },
		// msxsl: {
		// 	dances: {
		// 		files: {expand: true, src: ['svg/*.svg'], dest: 'svg/compiled/'},
		// 		schema: 'svg/schema.xsl'
		// 	},
		// 	zapateo: {
		// 		files: {expand: true, src: ['svg/zapateo/*.svg'], dest: 'svg/compiled/'},
		// 		schema: 'svg/zapateo/zapateo.xsl'
		// 	}
		// },
		clean: {
			build: {
				src: [
					'build/*',
					'!build/music'
				]
			},
			musicConvert: {
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
			musicConvert: {
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
		},
		command_run: {
			dancesSvgCompile: {
				options: {
					getCommand: function(file, dest) {
						var fileName = file.split("/").pop();
						return '"./tools/msxsl.exe" ' + file + ' svg/schema.xsl -o svg/compiled/' + fileName;
					}
				},
				files: [{expand: false, src: ['svg/*.svg']}],
			},
			zapateoSvgCompile: {
				options: {
					getCommand: function(file, dest) {
						var fileName = file.split("/").pop();
						return '"./tools/msxsl.exe" ' + file + ' svg/zapateo/zapateo.xsl -o svg/compiled/zapateo' + fileName;
					}
				},
				files: [{expand: true, src: ['svg/zapateo/*.svg']}],
			},
			musicConvert: {
				options: {
					getCommand: function(file, dest) {
						return '"./tools/sox.exe"  -V1 ' + file + ' ' + dest;
					}
				},
				files: [{expand: true, src: ['music/*/*.mp3'], dest: 'build/'}],
			}
		}
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
		'command_run:dancesSvgCompile',
		'command_run:zapateoSvgCompile'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'compileSvg',
		'uglify:build', 
		'cssmin:build',
		// 'xmlmin:build', //msxsl already minify the svg's
		'processhtml:build',
		'htmlmin:build',
		'concat:build',
		'copy:build'
	]);
	grunt.registerTask('musicConvert', [
		'clean:musicConvert',
		'copy:musicConvert',
		'command_run:musicConvert'
	]);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('deploy', ['ftp-deploy:production']);
	grunt.registerTask('docs', ['jsdoc:build']);

	grunt.registerTask('test', ['build']);
};
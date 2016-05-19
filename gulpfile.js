var gulp = require('gulp'),
	//wiredep = require('wiredep').stream,
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    notify = require('gulp-notify'),
    reload = browserSync.reload,
    rimraf = require('rimraf'),
    imagemin = require('gulp-imagemin'),
    rigger = require('gulp-rigger'),
    pngquant = require('imagemin-pngquant');

var projectName = "SmallSorting";    

var path = { //пути к файлам
	//готовые файлы
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		assets: 'build/assets/',
		fonts: 'build/fonts',
		libs: 'build/libs'
	},

	dist: {
		js: 'dist/js/',
		css: 'dist/css/'
	},

	src: { //пути к исходным файлам
		html: 'app/index.html',
		html2: 'app/**/*.html',
		js: 'app/js/main.js',
		scss: 'app/scss/**/*.scss',
		assets: 'app/assets/*', 
		fonts: 'app/fonts/**/*.*',
		libs: 'app/libs/**/*.*'
	},

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        assets: 'app/assets/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },

    clean: './build'
} 

gulp.task('html:build', function(){
		gulp.src(path.src.html)
			.pipe(rigger())
			.pipe(gulp.dest(path.build.html))
			.pipe(notify('HTML DONE!'))
			.pipe(reload({stream:true}));
});
 
gulp.task('scss:build', function(){
		gulp.src(path.src.scss)
			.pipe(concat('all.scss'))
			.pipe(sass().on('error', sass.logError))
			.pipe(uncss({
				html: [path.src.html2]
			}))
			.pipe(autoprefixer({
				browsers: ['last 10 version'],
				cascade: false
			}))
			.pipe(rename(projectName + '.css'))
			.pipe(gulp.dest(path.build.css))
			.pipe(notify('SASS:build DONE!'))
			.pipe(reload({stream:true}));
});

gulp.task('scss:dist', function(){
		gulp.src(path.build.css + projectName + '.css')
			.pipe(gulp.dest(path.dist.css))
			.pipe(minifyCss())
			.pipe(rename(projectName + '.min.css'))
			.pipe(gulp.dest(path.dist.css))
			.pipe(notify('SASS:dist DONE!'))
			.pipe(reload({stream:true}));
});

gulp.task('js:build', function(){
		gulp.src(path.src.js)
			.pipe(rigger())
			.pipe(rename(projectName + '.js'))
			.pipe(gulp.dest(path.build.js))
			.pipe(notify('JS:build DONE!'))
			.pipe(reload({stream:true}));
});

gulp.task('js:dist', function(){
		gulp.src(path.build.js + projectName + '.js')
			.pipe(gulp.dest(path.dist.js))	
			.pipe(uglify())
			.pipe(rename(projectName + '.min.js'))
			.pipe(gulp.dest(path.dist.js))
			.pipe(notify('JS:dist DONE!'))
			.pipe(reload({stream:true}));
});

gulp.task('image:build', function(){
		gulp.src(path.src.assets)
		    .pipe(imagemin({ //Сожмем их
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()],
	            interlaced: true
	        }))
	        .pipe(gulp.dest(path.build.assets)) //И бросим в build
	        .pipe(notify('IMAGE DONE!'))
	        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
	    gulp.src(path.src.fonts)
	        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('libs:build', function() {
	    gulp.src(path.src.libs)
	        .pipe(gulp.dest(path.build.libs))
});

gulp.task('browserSync', function(){
	browserSync({
		server:{
			baseDir: "./build"
		},
		port: 8080,
		open: true,
		notify: false
	});
});

gulp.task('build', [
		'fonts:build',
		'image:build',
		'scss:build',
		'js:build',
		'html:build',
]);

gulp.task('dist', [
		'js:dist',
		'scss:dist'
]);


gulp.task('watcher', function(){
	gulp.watch(path.src.html, ['html:build']);
	gulp.watch(path.src.scss, ['scss:build']);
	gulp.watch(path.src.js, ['js:build']);
	gulp.watch(path.src.assets, ['image:build']);
	gulp.watch(path.src.fonts, ['fonts:build']);
});

gulp.task('clean:build', function (cb) {
    rimraf('./build', cb);
});

gulp.task('clean:dist', function (cb) {
	rimraf('./dist', cb);
});

gulp.task('default', ['build', 'browserSync', 'watcher']);
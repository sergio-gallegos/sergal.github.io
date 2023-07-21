const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

const config = {
  dest: './docs',
  public: './public',
  sassFiles: './src/**/*.scss',
  htmlFiles: './src/**/*.html',
  assersFiles: './src/asserts/**/*',
  tsFiles: './src/**/*.ts',

  astroFiles: './docs/**/*.html',
  astroFilesDest: './public/**/*.html',
  urlPage: '/web-portafolio/',
}

// gulp.task('clear', () => {
//   return (gulp.src(config.dest, {read: true, allowEmpty: true})
//     .pipe(clean()));
// });

gulp.task('styles', () => {
  return gulp.src(config.sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(config.public));
});

gulp.task("scripts", () => {
  var tsconfig = require('./tsconfig.json');
  return gulp.src(config.tsFiles)
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest(config.public));
});

gulp.task('watchers-dev', () => {
  gulp.watch([config.sassFiles], gulp.series('styles'));
  gulp.watch([config.tsFiles], gulp.series('scripts'));
  return;
});

gulp.task('prepare-deploy', () => {
  return gulp.src('./docs/index.html', {base: './'})
    .pipe(replace(/href="\/_astro\/index.[\S]*.css"/g, 'href="main.css"'))
    .pipe(gulp.dest('./'));
});


gulp.task('build', 
  gulp.series('styles', 'scripts'));

gulp.task('dev', 
  gulp.series('build', 'watchers-dev' ));

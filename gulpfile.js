"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const uglify = require('gulp-uglify');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');

gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.woff2",
    "src/fonts/**/*.woff",
    "src/img/**",
    "src/js/**",
    "src/*.html"
  ], {
    base: "src"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copy-html", function () {
  return gulp.src(
    "src/*.html"
    , {
      base: "src"
    })
    .pipe(gulp.dest("build/"));
});

gulp.task("clean-js", function () {
  return del("build/js/*.js");
});

gulp.task('scripts', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, `iife`))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js/'));
});

gulp.task("clean-html", function () {
  return del("build/*.html");
});

gulp.task("css", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// gulp.task("min-js", function () {
//   return gulp.src("build/js/*.js")
//     .pipe(uglify())
//     .pipe(rename(function (path) {
//       path.basename +="-min";
//     }))
//     .pipe(gulp.dest("build/js/"));
// });

gulp.task("min-html", function (){
  return gulp.src("build/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true }))
    .pipe(gulp.dest("build/"));
});

gulp.task('js-watch', gulp.series('scripts'), function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.task ("refresh", function (done) {
    server.reload();
    done();
  });

  // "min-html"
  gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("src/*.html", gulp.series("clean-html", "copy-html", "min-html", "refresh"));
  // gulp.watch("src/js/*.js", gulp.series("clean-js", "scripts", "refresh"));
  gulp.watch('src/js/**/*.js', gulp.series('js-watch'));
});

gulp.task("clean", function () {
  return del("build");
});

// "min-html"
gulp.task("build", gulp.series("clean", "copy", "css", "scripts", "min-html"));
gulp.task("start", gulp.series("build", "server"));

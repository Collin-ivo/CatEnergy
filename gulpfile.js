"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var uglify = require('gulp-uglify');

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

gulp.task("copy-plugins", function () {
  return gulp.src([
    "node_modules/svgxuse/svgxuse.js",
    "node_modules/svgxuse/svgxuse.min.js"
  ])
    .pipe(gulp.dest("build/js/plugins"))
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

gulp.task("copy-js", function () {
  return gulp.src(
    "src/js/**"
    , {
      base: "src"
    })
    .pipe(gulp.dest("build/"));
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

gulp.task("min-js", function () {
  return gulp.src("build/js/*.js")
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename +="-min";
    }))
    .pipe(gulp.dest("build/js/"));
});

gulp.task("min-html", function (){
  return gulp.src("build/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true }))
    .pipe(gulp.dest("build/"));
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
  gulp.watch("src/js/*.js", gulp.series("clean-js", "copy-js", "min-js", "refresh"));
});

gulp.task("clean", function () {
  return del("build");
});

// "min-html"
gulp.task("build", gulp.series("clean", "copy", "copy-plugins", "css", "min-js", "min-html"));
gulp.task("start", gulp.series("build", "server"));

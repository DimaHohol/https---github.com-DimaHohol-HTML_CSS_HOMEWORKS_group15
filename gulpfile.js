const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const jsminify = require("gulp-js-minify");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const autoprefixer = require("gulp-autoprefixer");

// Шляхи до ресурсів проєкту
const paths = {
  styles: {
    src: "src/scss/**/*.scss",
    dest: "dist/css",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js",
  },
  images: {
    src: "src/img/**/*",
    dest: "dist/img",
  },
};

// Компіляція SCSS в CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat("styles.min.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Збірка JavaScript файлів
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Оптимізація зображень
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

// Видалення папки dist
function cleanDist() {
  return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
}

// Завдання build - збірка проєкту
const build = gulp.series(cleanDist, gulp.parallel(styles, scripts, images));

// Завдання dev - режим розробки з автоматичним перезавантаженням
function dev() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch("src/*.html").on("change", browserSync.reload);
}

exports.build = build;
exports.dev = dev;
exports.default = build;

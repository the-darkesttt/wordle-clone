// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();

function copyTask1Library() {
    return src("app/js/library/**/*.js").pipe(dest("dist/js/library"));
}

// Sass Task
function scssTask() {
    return src("app/scss/style.scss", { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
// function jsTask() {
//     return src("app/js/script.js", { sourcemaps: true })
//         .pipe(babel({ presets: ["@babel/preset-env"] }))
//         .pipe(terser())
//         .pipe(dest("dist", { sourcemaps: "." }));
// }
function jsTask() {
    return src("app/js/script.js", { sourcemaps: true })
        .pipe(
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            modules: false,
                        },
                    ],
                ],
            }),
        )
        .pipe(terser())
        .pipe(dest("dist", { sourcemaps: "." }));
}

// Browsersync
// function browserSyncServe(cb) {
//     browsersync.init({
//         server: {
//             baseDir: ".",
//         },
//         notify: {
//             styles: {
//                 top: "auto",
//                 bottom: "0",
//             },
//         },
//     });
//     cb();
// }
// function browserSyncReload(cb) {
//     browsersync.reload();
//     cb();
// }

function browserSyncServe(done) {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        port: 3000,
    });

    done();
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

// Watch Task
// function watchTask() {
//     watch("*.html", browserSyncReload);
//     watch(
//         ["app/scss/**/*.scss", "app/**/*.js"],
//         series(scssTask, jsTask, browserSyncReload),
//     );
// }

function watchTask() {
    watch("*.html", browserSyncReload);

    watch(["app/scss/**/*.scss"], series(scssTask, browserSyncReload));

    watch(
        ["app/js/**/*.js"],
        series(jsTask, copyTask1Library, browserSyncReload),
    );
}

// Default Gulp Task
// Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    copyTask1Library,
    browserSyncServe,
    watchTask,
);

exports.build = series(scssTask, jsTask, copyTask1Library);

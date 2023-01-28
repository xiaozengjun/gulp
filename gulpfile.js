var gulp = require('gulp')
var concat = require('gulp-concat')// 临时合并文件
var rename = require('gulp-rename')// 重命名
var uglify = require('gulp-uglify')// 压缩文件
var fileInclude = require('gulp-file-include')
var livereload = require("gulp-livereload")

gulp.task('utils', function() {
    return gulp.src('src/utils/**/*') // 找到目标源文件, 将数据读取到内存中
        // .pipe(concat('build.js')) // 临时合并文件
        // .pipe(gulp.dest('dist/js/')) // 输出到本地
        // .pipe(uglify()) // 压缩文件
        // .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(gulp.dest('dist/utils'))
        .pipe(livereload());
})
gulp.task('assets', function() {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'))
        .pipe(livereload());
})

gulp.task('html', function() {
    return gulp.src('src/html/**/*')
        .pipe(fileInclude())
        .pipe(gulp.dest('dist/html/'))
        .pipe(livereload());
})
// exports.default = (done) => {
//     console.log("run gulp default~");
//     done(); // gulp取消了同步任务，默认可以通过执行done回调函数的方式来结束异步任务。也可以自己返回一个异步函数。后面会介绍
// };

// 监视任务
gulp.task("watch", function(){
    livereload.listen(); // 开启监听
    // 确认监听的目标已经绑定响应的任务
    gulp.watch("./src/***/**/*.html", gulp.series('html'));
    gulp.watch(["./src/assets/less/*.less" , "./src/assets/js/*.js", "./src/assets/img"], gulp.series('assets'));
    gulp.watch("./src/utils/**/*", gulp.series('utils'));
});

// 生产环境gulp任务
gulp.task("default", gulp.series("utils", "assets", "html"));
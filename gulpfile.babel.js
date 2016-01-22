import url from 'url'

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

import autoprefixer from 'autoprefixer'
import browserSync from 'browser-sync'
import del from 'del'
import _ from 'lodash'
import nunjucks from 'nunjucks'
import map from 'vinyl-map'
import quaff from 'quaff'
import runSequence from 'run-sequence'
import yargs from 'yargs'

const $ = gulpLoadPlugins()
const args = yargs.argv
const bs = browserSync.create()

const config = require('./config')

function commaFlip (s) {
  let split = s.split(',')
  return split[1].trim() + ' ' + split[0].trim()
}

let data = quaff(config.dataFolder)
data = data['lists']

data = _.mapValues(data, function (n) {
  let convert = _.groupBy(n, 'District')

  convert = _.mapValues(convert, function (x) {
    let temp = {
      data: x,
      incumbent: _.cloneDeep(_.findWhere(x, function (m) {
        return x['Incumbent']
      }))
    }

    temp.incumbent.Candidate = commaFlip(temp.incumbent.Candidate)

    return temp
  })

  _.forEach(convert, function (district) {
    district.data = _.groupBy(district.data, 'Party')
  })

  return convert
})

let basePath = args.production ? url.resolve('/', config.deploy.key) + '/' : '/'
data.PATH_PREFIX = basePath

let fullPath = url.format({
  protocol: 'http',
  host: config.deploy.bucket,
  pathname: config.deploy.key
}) + '/'
data.PATH_FULL = fullPath

let env = nunjucks.configure(config.templateFolder)

gulp.task('templates', () => {
  let nunjuckify = map((code, filename) => {
    return env.renderString(code.toString(), {data: data})
  })

  // All .html files are valid, unless they are found in templates
  return gulp.src(['./app/**/*.html', `!${config.templateFolder}/**`])
    .pipe(nunjuckify)
    .pipe(gulp.dest('./.tmp'))
    .pipe($.if(args.production, $.htmlmin({collapseWhitespace: true})))
    .pipe($.if(args.production, gulp.dest('./dist')))
    .pipe($.size({title: 'templates'}))
})

gulp.task('styles', () => {
  return gulp.src('./app/styles/*.scss')
    .pipe($.newer('./.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['node_modules'],
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({browsers: ['last 2 versions']})
    ]))
    .pipe($.if(args.production, $.minifyCss({
      keepSpecialComments: 0
    })))
    .pipe($.sourcemaps.write(args.production ? '.' : undefined))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.if(args.production, gulp.dest('./dist/styles')))
    .pipe(bs.stream({match: '**/*.css'}))
    .pipe($.size({title: 'styles'}))
})

gulp.task('images', () => {
  gulp.src('./app/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe($.size({title: 'images'}))
})

gulp.task('clean', cb => {
  return del(['./.tmp/**', './dist/**', '!dist/.git'], {dot: true}, cb)
})

gulp.task('serve', ['styles', 'templates'], () => {
  bs.init({
    logConnections: true,
    logPrefix: 'NEWSAPPS',
    notify: false,
    open: false,
    port: 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })

  gulp.watch(['./app/styles/**/*.scss'], ['styles'])
  gulp.watch(['./app/**/*.html'], ['templates', bs.reload])
})

gulp.task('default', ['clean'], cb => {
  runSequence(['images', 'styles', 'templates'], cb)
})
gulp.task('build', ['default'])

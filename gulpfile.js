const gulp = require('gulp')
const config = require('./gulp.config')()
const stylus = require('gulp-stylus')
const log = require('fancy-log')
const cssnano = require('gulp-cssnano')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const copy = require('gulp-copy')
const through = require('through2')

const del = require('del')
const browserSync = require('browser-sync')

const { rollup } = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const buble = require('rollup-plugin-buble')
const { each } = require('lodash')

const server = browserSync.create()

function swallow(error) {
  if (error.messageFormatted) {
    log.error(`${error.messageFormatted}`)
  } else {
    log(error.toString())
  }
  this.emit('end')
}

function serve(done) {
  if (browserSync.active) {
    done()
  }
  log('Serving app')

  const options = config.options.browserSync
  log(options)
  server.init(options)
  done()
}

const clean = () => del([config.dest])

async function styles() {
  log('Compiling stylus')
  await gulp
    .src(config.stylus.src, {
      since: gulp.lastRun(styles)
    })
    .pipe(plumber({ errorHandler: swallow }))
    .pipe(sourcemaps.init())
    .pipe(stylus(config.options.stylus))
    .pipe(cssnano(config.options.cssnano))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.stylus.dest))
    .pipe(server.stream())
}

async function scripts() {
  log('Rolling scripts')

  const bundle = await rollup({
    input: config.scripts.src,
    plugins: [
      nodeResolve(),
      commonjs(config.options.commonjs),
      buble()      
    ]
  })

  await bundle
    .write({
      file: config.scripts.dest,
      format: 'iife',
      sourcemap: true
    })
  
  server.reload()    
}

async function html() {
  log('Copying html')

  const s = config.index
  await gulp.src(s.src).pipe(gulp.dest(s.dest))
  server.reload()
}

async function static() {
  log('Copying statics')

  await Promise.all(
    [config.assets, config.css].map(s => {
      return gulp
        .src(s.src)
        .pipe(gulp.dest(s.dest))
    })
  )
  server.reload()
}

function watch(done) {
  gulp.watch(config.stylus.src, styles)
  gulp.watch(config.scripts.watch, scripts)
  gulp.watch([config.index.src], html)

  // Copy whole folders
  // gulp.watch([config.assets.src, config.css.src], static)

  // Copy changed files
  each([config.assets, config.css], (item) => {
    const watcher = gulp.watch(item.src)
    watcher.on('change', (path) => {
      function verify() {
        const options = { objectMode: true };
        return through(
          options, 
          (file, enc, cb) => {
            log('Modified', file.path);
            server.reload()
          },
          (cb) => { cb() }
        )
      }

      return gulp
          .src(path)
          .pipe(copy(item.dest, { prefix: 2 }))
          .pipe(verify())
    })
  })
  done()
}

exports.clean = clean
exports.static = static
exports.styles = styles
exports.scripts = scripts
exports.build = gulp.series(clean, styles, scripts, static, html)
exports.default = gulp.series(
  html,
  static,
  serve,
  gulp.parallel(scripts, styles),
  watch
)

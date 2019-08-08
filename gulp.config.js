const path = require('path')
module.exports = function() {
  const src = path.join(__dirname, 'src')
  const dest = path.join(__dirname, 'dist')
  const config = {
    src,
    dest,
    index: {
      src: src + '/index.html',
      dest: dest + '/'
    },
    assets: {
      src: src + '/assets/**/*.*',
      dest: dest + '/assets'
    },
    scripts: {
      watch: [src + '/index.js', src + '/lib/**/*.*'],
      src: src + '/index.js',
      dest: dest + '/index.js'
    },
    css: {
      src: src + '/styles/**/*.css',
      dest: dest + '/styles'
    },
    stylus: {
      src: src + '/styles/**/*.styl',
      dest: dest + '/styles'
    },
    sass: {
      src: src + '/styles/**/*.scss',
      dest: dest + '/styles'
    },
    options: {
      commonjs: {
        include: 'node_modules/**',
        extensions: ['.js', '.coffee'],
        ignoreGlobal: false,
        sourceMap: false,
        namedExports: {
          'node_modules/lodash/lodash.js': [
              'each'
          ]
        }
      },
      cssnano: {
        sourcemap: true,
        autoprefixer: {
          add: true,
          browsers: []
        }
      },
      sass: {
        outputStyle: 'nested',
        includePaths: ['node_modules/']
      },
      stylus: {
        'include css': true
      },
      browserSync: {
        open: false,
        // disabled: watch static resources
        // files: [
        //   dest + '/styles/**/*.css',
        //   dest + '/assets/**/*.*'
        // ],
        // use manual server.reload instead inside gulpfile.js
        server: {
          baseDir: 'dist',
          index: 'index.html'
        },
        codeSync: true,
        port: 3333,
        ghostMode: {
          clicks: false,
          location: false,
          forms: false,
          scroll: false
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'rollinghaystack',
        notify: true,
        reloadDelay: 0,
        online: false      
      }    
    }    
  }

  return config
}

// export default {
//   jekyll: {
//     default: '_config.yml',
//     development: '_config_development.yml'
//   },
//   views: [
//     './src/schema/**/*.yml',
//     './src/views/collections/**/*.html',
//     './src/views/includes/*.html',
//     './src/views/layouts/*.html',
//     './src/views/pages/*.md',
//     './src/views/*.html',
//   ],
//   scripts: {
//     src: './src/scripts/bundle.js',
//     dest: './dist/assets/bundle.min.js'
//   },
//   styles: {
//     src: 'src/styles/**/*.scss',
//     dest: 'dist/assets'
//   },
//   browserSync: {
//     open: false,
//     ghostMode: false,
//     server: {
//       baseDir: './dist'
//     }
//   }

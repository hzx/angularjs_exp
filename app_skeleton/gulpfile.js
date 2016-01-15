
var gulp          =   require('gulp'),
    prefixer      =   require('gulp-autoprefixer'),
    concat        =   require('gulp-concat'),
    csso          =   require('gulp-csso'),
    less          =   require('gulp-less'),
    sourcemaps    =   require('gulp-sourcemaps'),
    uglify        =   require('gulp-uglify'),
    watch         =   require('gulp-watch'),

    AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

const BUILD = 'build';
const BUILD_JS = BUILD + '/js';
const BUILD_CSS = BUILD + '/css';

const APP_TEMPLATES = ['app/**/*.html'];
const I18N = ['i18n/**/*'];
const IMAGES = ['images/**/*'];

const THIRD_PARTY = [
  'third_party/jquery-1.11.3.min.js',
  'third_party/jquery.cookie.js',
  'third_party/jquery.slimscroll.js',
  'third_party/jquery-ui.min.js',
  'third_party/jquery.datetimepicker.full.min.js',

  'third_party/modernizr.min.js',
  'third_party/respond.min.js',

  'third_party/angular.min.js',
  'third_party/angular-translate.min.js',
  'third_party/angular-translate-loader-static-files.min.js',
  'third_party/angular-route.min.js',
  'third_party/angular-cookies.min.js',
  'third_party/angular-sanitize.min.js',
  'third_party/ngStorage.min.js',

  'third_party/angulartics.min.js',
  'third_party/angulartics-ga.min.js',
  'third_party/ng-optimizely.js',
  'third_party/ng-infinite-scroll.min.js',
  'third_party/ng-tags-input.js',
];

const THIRD_PARTY_CSS = [
    'css/magnific-popup.css',
    'css/jquery.datetimepicker.css',
    'css/style.css',
    'css/intro.css',
    'css/style-980.css',
    'css/style-800.css',
    'css/style-550.css',
    'css/style-400.css',
];

const APP_JS = [
    '!app/**/*_test.js',
    'app_utils/**/*.js',
    'app/app.js',
    'app/**/*.js',
];

const APP_DEBUG_JS = APP_JS.concat([
    'third_party/sinon-server-1.14.1.js',
    'node_modules/fakerest/dist/FakeRest.min.js',
    'rest/data.js', // fill rest objects here
    'rest/debugRest.js',
]);

console.log('APP_DEBUG_JS: ', APP_DEBUG_JS);

const APP_JS_OUT = 'app.js';

const APP_MAIN_LESS = 'less/main.less';

const APP_MAIN_CSS = [
    'css/reset.css',
    'css/main.css',
];

const APP_LESS = [
    'css/reset.css',
    'css/pmc.css',
    'less/**/*.less',
    'app/**/*.less',
];

const APP_CSS_OUT = 'app.css';

const APP_TEST_JS = [
    'bower_components/angular-mocks/angular-mocks.js',
    'app/**/*.js',
];


gulp.task('app_template', function() {
    gulp.src(['index.html'])
        .pipe(concat('index.html'))
        .pipe(gulp.dest(BUILD));
});


gulp.task('app_templates', function() {
    gulp.src(APP_TEMPLATES)
        .pipe(gulp.dest(BUILD + '/app'));
});


gulp.task('i18n', function() {
    gulp.src(I18N)
        .pipe(gulp.dest(BUILD + '/i18n'));
});


gulp.task('images', function() {
    gulp.src(IMAGES)
        .pipe(gulp.dest(BUILD + '/images'));
});


gulp.task('fonts', function() {
    gulp.src(['fonts/**/*'])
        .pipe(gulp.dest(BUILD + '/fonts'));
});


gulp.task('third_party', function() {
    gulp.src(THIRD_PARTY)
        .pipe(gulp.dest(BUILD_JS));
});


gulp.task('app_js', function() {
    gulp.src(APP_DEBUG_JS)
        .pipe(concat(APP_JS_OUT))
        .pipe(gulp.dest(BUILD_JS));
});


gulp.task('third_party_css', function() {
    gulp.src(THIRD_PARTY_CSS)
        .pipe(gulp.dest(BUILD_CSS));
});


gulp.task('app_js_release', function() {
    gulp.src(APP_JS)
        .pipe(sourcemaps.init())
        .pipe(concat(APP_JS_OUT))
        .pipe(uglify())
        .pipe(sourcemaps.write('./', { addComment: true }))
        .pipe(gulp.dest(BUILD_JS));
});


gulp.task('app_less', function() {
    gulp.src(APP_MAIN_LESS)
        .pipe(less())
        .pipe(gulp.dest(BUILD_CSS));
    gulp.src(APP_MAIN_CSS)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(BUILD_CSS));
});


gulp.task('app_less_release', function() {
    gulp.src(APP_MAIN_LESS)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer(AUTOPREFIXER_BROWSERS))
        .pipe(csso())
        .pipe(sourcemaps.write('./', { addComment: true }))
        .pipe(gulp.dest(BUILD_CSS));
    gulp.src(APP_MAIN_CSS)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(BUILD_CSS));
});


gulp.task('watch', function() {
    gulp.watch(['index.html'], ['app_template']);
    gulp.watch(APP_TEMPLATES, ['app_templates']);
    gulp.watch(THIRD_PARTY, ['third_party']);
    gulp.watch(APP_DEBUG_JS, ['app_js']);
    gulp.watch(APP_LESS, ['app_less']);
});


// debug build without watch
gulp.task('default', [
    'fonts','app_template', 'app_templates', 'i18n', 'images',
    'third_party', 'third_party_css',
    'app_js', 'app_less',
]);

gulp.task('debug', ['default', 'watch']);

gulp.task('release', [
    'fonts', 'app_template', 'app_templates', 'i18n', 'images',
    'third_party', 'third_party_css',
    'app_js_release', 'app_less_release',
]);

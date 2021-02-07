const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sourceMaps(true, 'source-map');

mix.js('resources/js/app.js', 'public/assets/js')
    .js('resources/js/vendor.js', 'public/assets/js')
    .sass('resources/sass/app.scss', 'public/assets/css')
    .sass('resources/sass/vendor.scss', 'public/assets/css')
    .copyDirectory('resources/images', 'public/assets/images')
    ;
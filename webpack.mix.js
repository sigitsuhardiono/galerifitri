let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

/*
 |--------------------------------------------------------------------------
 | Mix For Core css and js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap.css',
    'resources/assets/plugin/css/waves.css',
    'resources/assets/plugin/css/animate.css'
], 'public/css/core.css');

mix.styles([
    'resources/assets/css/style.css'
], 'public/css/style.css');

mix.styles([
    'resources/assets/css/theme/theme-pink.css'
], 'public/css/pink.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.min.js',
    'resources/assets/plugin/js/bootstrap.js',
    'resources/assets/plugin/js/waves.js',
    'resources/assets/plugin/js/jquery.slimscroll.js'
], 'public/js/core.js');

mix.scripts([
    'resources/assets/plugin/js/jquery.min.js',
    'resources/assets/plugin/js/bootstrap.js',
    'resources/assets/plugin/js/waves.js'
], 'public/js/core-login.js');

mix.scripts([
    'resources/assets/js/admin.js'
], 'public/js/admin.js');

mix.scripts([
    'resources/assets/js/demo.js'
], 'public/js/demo.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Home js
 |--------------------------------------------------------------------------
 */
mix.scripts([
    'resources/assets/plugin/js/jquery.countTo.js',
    'resources/assets/plugin/js/Chart.bundle.js'
], 'public/plugin/js/home.js');

mix.scripts([
    'resources/assets/js/pages/home.js'
], 'public/js/pages/home.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Product js
 |--------------------------------------------------------------------------
 */

mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/sweetalert.css',
    'resources/assets/plugin/css/magnific-popup.css'
], 'public/plugin/css/product.css');

mix.scripts([
    'resources/assets/plugin/js/blockui.min.js',
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/bootstrap-notify.js',
    'resources/assets/plugin/js/sweetalert.min.js',
    'resources/assets/plugin/js/jquery.magnific-popup.min.js',
    'resources/assets/plugin/js/touchspin.min.js'
], 'public/plugin/js/product.js');

mix.scripts([
    'resources/assets/js/pages/product.js'
], 'public/js/pages/product.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Detailcart js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/custom-step.css',
    'resources/assets/plugin/css/sweetalert.css'
], 'public/plugin/css/detailcart.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/blockui.min.js',
    'resources/assets/plugin/js/bootstrap-notify.js',
    'resources/assets/plugin/js/jquery.validate.js',
    'resources/assets/plugin/js/sweetalert.min.js',
    'resources/assets/plugin/js/jquery.chained.min.js',
    'resources/assets/plugin/js/jquery.chained.remote.min.js',
    'resources/assets/plugin/js/touchspin.min.js',
], 'public/plugin/js/detailcart.js');

mix.scripts([
    'resources/assets/js/pages/detailcart.js',
], 'public/js/pages/detailcart.js');

/*
 |--------------------------------------------------------------------------
 | Mix For History js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css',
    'resources/assets/plugin/css/bootstrap-material-datetimepicker.css'
], 'public/plugin/css/history.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/jquery.countTo.js',
    'resources/assets/plugin/js/moment.js',
    'resources/assets/plugin/js/bootstrap-material-datetimepicker.js'
], 'public/plugin/js/history.js');

mix.scripts([
    'resources/assets/js/pages/history.js'
], 'public/js/pages/history.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Komisi js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/komisi.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/komisi.js');

mix.scripts([
    'resources/assets/js/pages/komisi.js'
], 'public/js/pages/komisi.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Isideposit js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/bootstrap-material-datetimepicker.css'
], 'public/plugin/css/isideposit.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/moment.js',
    'resources/assets/plugin/js/bootstrap-material-datetimepicker.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/isideposit.js');

mix.scripts([
    'resources/assets/js/pages/isideposit.js'
], 'public/js/pages/isideposit.js');
/*
 |--------------------------------------------------------------------------
 | Mix For Confirm-trans js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/sweetalert.css'
], 'public/plugin/css/confirm-trans.css');

mix.scripts([
    'resources/assets/plugin/js/blockui.min.js',
    'resources/assets/plugin/js/sweetalert.min.js'
], 'public/plugin/js/confirm-trans.js');

mix.scripts([
    'resources/assets/js/pages/confirm-trans.js'
], 'public/js/pages/confirm-trans.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Deposit js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/deposit.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/deposit.js');

mix.scripts([
    'resources/assets/js/pages/deposit.js'
], 'public/js/pages/deposit.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Reseller js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/reseller.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/reseller.js');

mix.scripts([
    'resources/assets/js/pages/reseller.js'
], 'public/js/pages/reseller.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahreseller js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/bootstrap-spinner.css'
], 'public/plugin/css/tambahreseller.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.spinner.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/tambahreseller.js');

mix.scripts([
    'resources/assets/js/pages/tambahreseller.js'
], 'public/js/pages/tambahreseller.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Editreseller js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/bootstrap-spinner.css'
], 'public/plugin/css/editreseller.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.spinner.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/editreseller.js');

mix.scripts([
    'resources/assets/js/pages/editreseller.js'
], 'public/js/pages/editreseller.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Marketer js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/marketer.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/marketer.js');

mix.scripts([
    'resources/assets/js/pages/marketer.js'
], 'public/js/pages/marketer.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahmarketer js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/tambahmarketer.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/tambahmarketer.js');

mix.scripts([
    'resources/assets/js/pages/tambahmarketer.js'
], 'public/js/pages/tambahmarketer.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Editmarketer js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/editmarketer.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/editmarketer.js');

mix.scripts([
    'resources/assets/js/pages/editmarketer.js'
], 'public/js/pages/editmarketer.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Pelanggan js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/pelanggan.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/pelanggan.js');

mix.scripts([
    'resources/assets/js/pages/pelanggan.js'
], 'public/js/pages/pelanggan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahpelanggan js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/tambahpelanggan.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/tambahpelanggan.js');

mix.scripts([
    'resources/assets/js/pages/tambahpelanggan.js'
], 'public/js/pages/tambahpelanggan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Editpelanggan js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/editpelanggan.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/editpelanggan.js');

mix.scripts([
    'resources/assets/js/pages/editpelanggan.js'
], 'public/js/pages/editpelanggan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahproduk js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dropzone.css',
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/tambahproduk.css');

mix.scripts([
    'resources/assets/plugin/js/dropzone.js',
    'resources/assets/plugin/js/bootstrap-select.js'
], 'public/plugin/js/tambahproduk.js');

mix.scripts([
    'resources/assets/js/pages/tambahproduk.js'
], 'public/js/pages/tambahproduk.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahproduk js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dropzone.css',
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/editproduk.css');

mix.scripts([
    'resources/assets/plugin/js/dropzone.js',
    'resources/assets/plugin/js/bootstrap-select.js'
], 'public/plugin/js/editproduk.js');

mix.scripts([
    'resources/assets/js/pages/editproduk.js'
], 'public/js/pages/editproduk.js');
/*
 |--------------------------------------------------------------------------
 | Mix For Login js
 |--------------------------------------------------------------------------
 */
mix.scripts([
    'resources/assets/plugin/js/jquery.validate.js',
    'resources/assets/js/pages/login.js'
], 'public/js/pages/login.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Brand js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/brand.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/brand.js');

mix.scripts([
    'resources/assets/js/pages/brand.js'
], 'public/js/pages/brand.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Laporan Marketer js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/laporanmarketer.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/laporanmarketer.js');

mix.scripts([
    'resources/assets/js/pages/laporanmarketer.js'
], 'public/js/pages/laporanmarketer.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Laporan REseller js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/laporanreseller.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/laporanreseller.js');

mix.scripts([
    'resources/assets/js/pages/laporanreseller.js'
], 'public/js/pages/laporanreseller.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Laporan Penjualan js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css',
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/laporanpenjualan.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/laporanpenjualan.js');

mix.scripts([
    'resources/assets/js/pages/laporanpenjualan.js'
], 'public/js/pages/laporanpenjualan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For User js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/dataTables.bootstrap.css',
    'resources/assets/plugin/css/rowReorder.dataTables.min.css',
    'resources/assets/plugin/css/responsive.dataTables.min.css'
], 'public/plugin/css/rekanan.css');

mix.scripts([
    'resources/assets/plugin/js/jquery.dataTables.js',
    'resources/assets/plugin/js/dataTables.bootstrap.js',
    'resources/assets/plugin/js/dataTables.buttons.min.js',
    'resources/assets/plugin/js/dataTables.rowReorder.min.js',
    'resources/assets/plugin/js/dataTables.responsive.min.js',
    'resources/assets/plugin/js/buttons.flash.min.js',
    'resources/assets/plugin/js/jszip.min.js',
    'resources/assets/plugin/js/pdfmake.min.js',
    'resources/assets/plugin/js/jvfs_fonts.js',
    'resources/assets/plugin/js/buttons.html5.min.js',
    'resources/assets/plugin/js/buttons.print.min.js'
], 'public/plugin/js/rekanan.js');

mix.scripts([
    'resources/assets/js/pages/rekanan.js'
], 'public/js/pages/rekanan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Tambahmarketer js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/tambahrekanan.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/tambahrekanan.js');

mix.scripts([
    'resources/assets/js/pages/tambahrekanan.js'
], 'public/js/pages/tambahrekanan.js');

/*
 |--------------------------------------------------------------------------
 | Mix For Edituser js
 |--------------------------------------------------------------------------
 */
mix.styles([
    'resources/assets/plugin/css/bootstrap-select.css'
], 'public/plugin/css/editrekanan.css');

mix.scripts([
    'resources/assets/plugin/js/bootstrap-select.js',
    'resources/assets/plugin/js/jquery.inputmask.bundle.js'
], 'public/plugin/js/editrekanan.js');

mix.scripts([
    'resources/assets/js/pages/editrekanan.js'
], 'public/js/pages/editrekanan.js');

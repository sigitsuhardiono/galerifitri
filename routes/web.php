<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();
Route::get('/', 'HomeController@index');
Route::get('/home', 'HomeController@index');
Route::get('/product', 'ItemController@index');
Route::post('/product', 'ItemController@index');
Route::post('/product/addcartmultiple', 'ItemController@addchartmultiple');
Route::post('/product/addcart', 'ItemController@addchart');
Route::get('/product/getcart', 'ItemController@getcart');
Route::get('/product/detailcart', 'ItemController@detailcart');
Route::post('/product/hapuscart', 'ItemController@deletecart');
Route::get('/profile', 'HomeController@profile');
Route::post('simpan-transaksi', 'ItemController@simpantransaksi');
Route::post('/provinsi', 'ItemController@tampilprovinsi');
Route::post('/kota', 'ItemController@tampilkota');
Route::post('/harga', 'ItemController@tampilharga');
Route::post('/customer', 'ItemController@tampilcustomer');
Route::post('/customerid', 'ItemController@tampilcustomerid');
Route::post('/shop/proses_pelanggan', 'ItemController@savecustomer');
Route::get('/shop/history', 'ItemController@history');
Route::get('/showtransaction', 'ItemController@showhistory');
Route::get('/shop/konfirmasi/{id}', 'ItemController@confirmshop');
Route::get('/shop/print/{id}', 'ItemController@printlabel');
Route::get('/shop/detail/{id}', 'ItemController@detailshop');
Route::get('/shop/konfirmkirim/{id}', 'ItemController@konfirmkirim');
Route::get('/shop/inputresi/{id}', 'ItemController@inputresi');
Route::post('simpan-resi', 'ItemController@simpanresi');
Route::post('/shop/konfirmasitransfer', 'ItemController@konfirmasitransfer');
Route::get('/shop/deposit', 'ItemController@deposit');
Route::get('/komisi', 'HomeController@komisi');
Route::get('/deposit', 'HomeController@deposit');
Route::get('/isideposit', 'HomeController@isideposit');
Route::post('simpan-deposit', 'HomeController@simpandeposit');
Route::get('/showkomisi', 'HomeController@showkomisi');
Route::get('/showdeposit', 'HomeController@showdeposit');
Route::get('/showreseller', 'HomeController@showreseller');
Route::get('/shop/reseller', 'HomeController@reseller');
Route::get('/tambahreseller', 'HomeController@tambahreseller');
Route::post('simpan-reseller', 'HomeController@simpanreseller');
Route::get('/showmarketer', 'HomeController@showmarketer');
Route::get('/shop/marketer', 'HomeController@marketer');
Route::get('/tambahmarketer', 'HomeController@tambahmarketer');
Route::post('simpan-marketer', 'HomeController@simpanmarketer');
Route::get('/showpelanggan', 'HomeController@showpelanggan');
Route::get('/shop/pelanggan', 'HomeController@pelanggan');
Route::get('/tambahpelanggan', 'HomeController@tambahpelanggan');
Route::post('simpan-pelanggan', 'HomeController@simpanpelanggan');
Route::get('/shop/marketer/edit/{id}', 'HomeController@editmarketer');
Route::get('/shop/pelanggan/edit/{id}', 'HomeController@editpelanggan');
Route::get('/shop/reseller/edit/{id}', 'HomeController@editreseller');
Route::post('edit-marketer', 'HomeController@updatemarketer');
Route::post('edit-reseller', 'HomeController@updatereseller');
Route::post('edit-pelanggan', 'HomeController@updatepelanggan');
Route::get('/shop/pelanggan/delete/{id}', 'HomeController@deletepelanggan');
Route::get('/product/tambah', 'ItemController@tambahproduk');
Route::get('/product/edit/{id}', 'ItemController@editproduk');
Route::post('simpan-produk', 'ItemController@simpanproduk');
Route::post('edit-produk', 'ItemController@updateproduk');
Route::get('/brand', 'HomeController@brand');
Route::get('/showbrand', 'HomeController@showbrand');
Route::get('/tambahbrand', 'HomeController@tambahbrand');
Route::post('simpan-brand', 'HomeController@simpanbrand');
Route::get('/brand/edit/{id}', 'HomeController@editbrand');
Route::post('edit-brand', 'HomeController@updatebrand');
Route::get('/brand/delete/{id}', 'HomeController@deletebrand');
Route::get('/shop/reseller/delete/{id}', 'HomeController@deletereseller');
Route::get('/shop/marketer/delete/{id}', 'HomeController@deletemarketer');
Route::get('/reseller/detail/{id}', 'HomeController@detailreseller');
Route::get('/marketer/detail/{id}', 'HomeController@detailmarketer');
Route::get('/shop/laporanmarketer', 'ItemController@laporanmarketer');
Route::get('/showlaporanmarketer', 'ItemController@showlaporanmarketer');
Route::get('/shop/laporanreseller', 'ItemController@laporanreseller');
Route::get('/showlaporanreseller', 'ItemController@showlaporanreseller');
Route::get('/shop/laporanpenjualan', 'ItemController@laporanpenjualan');
Route::get('/showlaporanpenjualan', 'ItemController@showlaporanpenjualan');
Route::get('/shop/rekanan', 'HomeController@rekanan');
Route::get('/tambahrekanan', 'HomeController@tambahrekanan');
Route::post('simpan-rekanan', 'HomeController@simpanrekanan');
Route::get('/showrekanan', 'HomeController@showrekanan');
Route::get('/shop/rekanan/edit/{id}', 'HomeController@editrekanan');
Route::post('edit-rekanan', 'HomeController@updaterekanan');
Route::get('/shop/rekanan/delete/{id}', 'HomeController@deleterekanan');
Route::get('/user', 'HomeController@user');





@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DATA PENJUALAN</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <form class="form-horizontal">
                                <div class="row clearfix">
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 form-control-label">
                                        <label for="tgl_awal">Periode </label>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-4 col-xs-4">
                                        <div class="form-group">
                                            <div class="form-line">
                                                <select class="form-control show-tick" id="bulan" name="bulan" required>
                                                    <option <?php if(date('m') == "01"){ echo 'selected';}?> value="01">Januari</option>
                                                    <option <?php if(date('m') == "02"){ echo 'selected';}?> value="02">Febuari</option>
                                                    <option <?php if(date('m') == "03"){ echo 'selected';}?> value="03">Maret</option>
                                                    <option <?php if(date('m') == "04"){ echo 'selected';}?> value="04">April</option>
                                                    <option <?php if(date('m') == "05"){ echo 'selected';}?> value="05">Mei</option>
                                                    <option <?php if(date('m') == "06"){ echo 'selected';}?> value="06">Juni</option>
                                                    <option <?php if(date('m') == "07"){ echo 'selected';}?> value="07">Juli</option>
                                                    <option <?php if(date('m') == "08"){ echo 'selected';}?> value="08">Agustus</option>
                                                    <option <?php if(date('m') == "09"){ echo 'selected';}?> value="09">September</option>
                                                    <option <?php if(date('m') == "10"){ echo 'selected';}?> value="10">Oktober</option>
                                                    <option <?php if(date('m') == "11"){ echo 'selected';}?> value="11">Nopember</option>
                                                    <option <?php if(date('m') == "12"){ echo 'selected';}?> value="12">Desember</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-4 col-xs-3">
                                        <div class="form-group">
                                            <div class="form-line">
                                                <select class="form-control show-tick" id="tahun" name="tahun" required>
                                                    <option value="2018">2018</option>
                                                    <option value="2017">2017</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row clearfix">
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 form-control-label">
                                        <label for="tgl_awal">Mulai</label>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4">
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="tgl_awal" class="date form-control" placeholder="Tanggal mulai" value="<?php echo date("Y-m-01")?>">
                                            </div>
                                        </div>
                                    </div>   
                                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 form-control-label">
                                        <label for="tgl_akhir">Hingga</label>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4">
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="tgl_akhir" class="date form-control" placeholder="Tanggal selesai" value="<?php echo date("Y-m-t")?>">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2 form-control-label">
                                        <label for="tgl_awal">Code</label>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-10 col-xs-7">
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="keyword" class="form-control" placeholder="Code">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-lg-offset-1 col-md-offset-2 col-sm-offset-4 col-xs-offset-5">
                                        <button id="btn_cari" type="button" class="btn bg-purple waves-effect col-md-4">
                                            <i class="material-icons">search</i>
                                            <span>SEARCH</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row clearfix">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-red">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="content">
                            <div class="text">TOTAL PENJUALAN</div>
                            <div id="total-penjualan" class="number"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-indigo">
                            <i class="material-icons">money_off</i>
                        </div>
                        <div class="content">
                            <div class="text">TOTAL DISKON</div>
                            <div id="total-diskon" class="number"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-purple">
                            <i class="material-icons">shopping_cart</i>
                        </div>
                        <div class="content">
                            <div class="text">JUMLAH TRANSAKSI</div>
                            <div id="total-transaksi" class="number"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-deep-purple">
                            <i class="material-icons">style</i>
                        </div>
                        <div class="content">
                            <div class="text">PRODUK TERJUAL</div>
                            <div id="total-produk" class="number"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            @if (\Session::has('success'))
                                <div class="alert bg-green alert-dismissible" role="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                                                aria-hidden="true">×</span></button>
                                    {{ \Session::get('success') }}
                                </div>
                            @endif
                                <table id="js-history" class="table table-bordered table-striped table-hover dataTable js-history table-small" style="width:100%">                    
                                    <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Rekanan</th>
                                        <th>Pengirim</th>
                                        <th>Pelanggan</th>
                                        <th>HP</th>
                                        <th>Alamat</th>
                                        <th>Total</th>
                                        <th>Diskon</th>
                                        <th>Jumlah</th>
                                        <th>Ongkir</th>
                                        <th>Grand Total</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Code</th>
                                        <th>Rekanan</th>
                                        <th>Pengirim</th>
                                        <th>Pelanggan</th>
                                        <th>HP</th>
                                        <th>Alamat</th>
                                        <th>Total</th>
                                        <th>Diskon</th>
                                        <th>Jumlah</th>
                                        <th>Ongkir</th>
                                        <th>Grand Total</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </tfoot>
                                </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div id="invoiceData" class="modal fade">
        <div class="modal-dialog modal-lg ">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Detail Invoice</h4>
                </div>
                <div class="modal-body invoice-body">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    </div>

@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/history.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/history.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/history.js')}}"></script>
@stop


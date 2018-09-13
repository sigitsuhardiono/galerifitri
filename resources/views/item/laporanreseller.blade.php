@extends('layout.template')
@section('content')
    <style>
        th.dt-center, td.dt-center { text-align: center; }
    </style>
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>LAPORAN RESELLER</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <form class="form-horizontal">
                                <div class="row clearfix">
                                    <div class="col-lg-1 col-md-1 col-sm-4 col-xs-4 form-control-label">
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
                                    <div class="col-lg-2 col-md-2 col-sm-4 col-xs-4">
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
                                    <div class="col-lg-1 col-md-1 col-sm-4 col-xs-5 form-control-label">
                                        <label for="tgl_awal">Nama</label>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-8 col-xs-7">
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
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                                <table id="js-reseller" class="table table-bordered table-striped table-hover dataTable js-reseller table-small" style="width:100%">
                                    <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Induk</th>
                                        <th>Sisa Deposit</th>
                                        <th>Transaksi</th>
                                        <th>Target</th>
                                        <th>Sisa</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Induk</th>
                                        <th>Sisa Deposit</th>
                                        <th>Transaksi</th>
                                        <th>Target</th>
                                        <th>Sisa</th>
                                    </tr>
                                    </tfoot>
                                </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/laporanreseller.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/laporanreseller.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/laporanreseller.js')}}"></script>
@stop

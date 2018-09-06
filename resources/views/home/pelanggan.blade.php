@extends('layout.template')
@section('content')
    <style>
        th.dt-center, td.dt-center { text-align: center; }
    </style>
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DATA PELANGGAN</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <a href="{{url("tambahpelanggan")}}" class="btn bg-pink waves-effect">
                                <i class="material-icons">add</i>
                                <span>Tambah Pelanggan</span>
                            </a>
                            <br/>
                            <br/>
                                <table id="js-pelanggan" class="table table-bordered table-striped table-hover dataTable js-pelanggan table-small" style="width:100%">
                                    <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Alamat</th>
                                        <th>Telp</th>
                                        <th>Propinsi</th>
                                        <th>Kota</th>
                                        <th>Rekanan</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Alamat</th>
                                        <th>Telp</th>
                                        <th>Propinsi</th>
                                        <th>Kota</th>
                                        <th>Rekanan</th>
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
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/pelanggan.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/pelanggan.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/pelanggan.js')}}"></script>
@stop

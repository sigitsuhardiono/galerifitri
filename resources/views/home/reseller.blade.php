@extends('layout.template')
@section('content')
    <style>
        th.dt-center, td.dt-center { text-align: center; }
    </style>
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DATA RESELLER</h2>
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
                            <a href="{{url("tambahreseller")}}" class="btn bg-pink waves-effect">
                                <i class="material-icons">add</i>
                                <span>Tambah Reseller</span>
                            </a>
                            <br/>
                            <br/>
                                <table id="js-reseller" class="table table-bordered table-striped table-hover dataTable js-reseller table-small" style="width:100%">
                                    <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Alamat</th>
                                        <th>Telp</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Alamat</th>
                                        <th>Telp</th>
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
    <div id="detailData" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Detail Reseller</h4>
                </div>
                <div class="modal-body detail-body">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    </div>

@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/reseller.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/reseller.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/reseller.js')}}"></script>
@stop

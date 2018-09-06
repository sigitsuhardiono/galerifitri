@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DATA DEPOSIT</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <div class="row clearfix">
                                <form class="form-horizontal" action="#" onsubmit="return reloadData()">'
                                    <div class="col-md-12 text-center text-semibold">
                                        <h4>Silahkan Hubungi Distributor / Agen Untuk Menambah Isi Dompet</h4>
                                        <a class="btn btn-xs btn-success" target="__blank" href="https://api.whatsapp.com/send?phone=081336419207&amp;text=Assalamualaikum,%20Mau%20Tambah%20Isi%20Dompet%20BBH%20Sebesar%20:%20Rp.%20">HUBUNGI SEKARANG</a>
                                        <br><br>
                                    </div>
                                    <div class="col-md-12 ">
                                    </div>
                                </form>
                            </div>
                                <table id="js-deposit" class="table table-bordered table-striped table-hover dataTable js-deposit" style="width:100%">
                                    <thead>
                                    <tr>
                                        <th>Nominal</th>
                                        <th>Note</th>
                                        <th>Tanggal Transfer</th>
                                        <th>Tanggal Approval</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Nominal</th>
                                        <th>Note</th>
                                        <th>Tanggal Transfer</th>
                                        <th>Tanggal Approval</th>
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
    <link href="{{mix('plugin/css/deposit.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/deposit.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/deposit.js')}}"></script>
@stop

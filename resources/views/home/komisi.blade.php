@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DATA KOMISI</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-red">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="content">
                            <div class="text">TOTAL KOMISI</div>
                            <div id="total-komisi" class="number"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                                <table id="js-komisi" class="table table-bordered table-striped table-hover dataTable js-komisi table-small" style="width:100%">
                                    <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Rekanan</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Code</th>
                                        <th>Rekanan</th>
                                        <th>Total</th>
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
    <link href="{{mix('plugin/css/komisi.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/komisi.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/komisi.js')}}"></script>
@stop

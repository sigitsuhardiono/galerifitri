@extends('layout.template')
@section('content')
<section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DASHBOARD</h2>
            </div>

            <!-- Widgets -->
            <div class="row clearfix">
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div class="info-box hover-expand-effect">
                        <div class="icon bg-pink ">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="content">
                            <div class="text">Total Penjualan Bulan Ini :</div>
                            <div class="number count-to" data-from="0" data-to="{{$totalPenjualan}}" data-speed="1000" data-fresh-interval="20"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div class="info-box hover-expand-effect">
                        <div class="icon bg-cyan">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="content">
                            <div class="text">Penjualan Marketer Bulan Ini :</div>
                            <div class="number count-to" data-from="0" data-to="{{$totalPenjualanMarketer}}" data-speed="1000" data-fresh-interval="20"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div class="info-box hover-expand-effect">
                        <div class="icon  bg-light-green">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="content">
                            <div class="text">Penjualan Reseller Bulan Ini :</div>
                            <div class="number count-to" data-from="0" data-to="{{$totalPenjualanReseller}}" data-speed="1000" data-fresh-interval="20"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #END# Widgets -->
            <!-- Widgets -->
            <div class="row clearfix">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="panel panel-default border-info">
                        <div class="panel-body text-semibold text-center">
                            <h6 class="panel-title">TOP 5 MARKETER BULAN INI</h6>                   
                            <div class="table-responsive">
                                <table class="table table-framed small">
                                    <thead>
                                        <tr>
                                            <th class="text-left">NAMA</th>
                                            <th class="text-right">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    @if(empty($topsMarketer))
                                        <tr>
                                            <td class="text-center small">Belum ada data</td>
                                        </tr>
                                    @else
                                        @foreach ($topsMarketer as $topMarketer)
                                            @if($topMarketer->shops_count > 0)
                                            <tr>
                                                <th class="text-left small">{{$topMarketer->name}}</th>
                                                <th class="text-right small">{{$topMarketer->shops_count}}</th>
                                            </tr>
                                            @endif
                                        @endforeach
                                    @endif
                                    </tbody>
                                </table>
                                <br>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="panel panel-default border-info">
                        <div class="panel-body text-semibold text-center">
                            <h6 class="panel-title">TOP 5 PRODUK BULAN INI</h6>                   
                            <div class="table-responsive">
                                <table class="table table-framed small">
                                    <thead>
                                        <tr>
                                            <th class="text-left">NAMA PRODUK</th>
                                            <th class="text-right">JUMLAH</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    @if(empty($topsReseller))
                                        <tr>
                                            <td class="text-center small">Belum ada data</td>
                                        </tr>
                                    @else
                                        @foreach ($topsReseller as $topReseller)
                                            @if($topReseller->shops_count > 0)
                                                <tr>
                                                    <th class="text-left small">{{$topMarketer->name}}</th>
                                                    <th class="text-right small">{{$topMarketer->shops_count}}</th>
                                                </tr>
                                            @endif
                                        @endforeach
                                    @endif
                                    </tbody>
                                </table>
                                <br>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>PROGRESS PENJUALAN</h2>
                            <ul class="header-dropdown m-r--5">
                                <li class="dropdown">
                                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                        <i class="material-icons">more_vert</i>
                                    </a>
                                    <ul class="dropdown-menu pull-right">
                                        <li><a href="javascript:void(0);">Action</a></li>
                                        <li><a href="javascript:void(0);">Another action</a></li>
                                        <li><a href="javascript:void(0);">Something else here</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class="body">
                            <canvas id="line_chart" height="150"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script>
        var data_line = '{{json_encode($linePenjualan)}}';
        var data_bulan = '{{json_encode($bulanPenjualan)}}';
    </script>
@stop
@section('plugin-js')
    <script src="{{mix('plugin/js/home.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/home.js')}}"></script>
@stop

@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>KATALOG PRODUK</h2>
            </div>
            <div class="row clearfix">
                @if (\Session::has('success'))
                    <div class="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                        <div class="alert bg-green alert-dismissible" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                                        aria-hidden="true">×</span></button>
                            {{ \Session::get('success') }}
                        </div>
                    </div>
                @endif
                @if(Auth::user()->detail->levels_id == "1")
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">

                            <a href="product/tambah" class="btn bg-pink waves-effect">
                                <i class="material-icons">add</i>
                                <span>TAMBAH PRODUK</span>
                            </a>
                            <a href="brand" class="btn bg-cyan waves-effect">
                                <i class="material-icons">favorite</i>
                                <span>BRAND</span>
                            </a>
                        </div>
                    </div>
                </div>
                @endif
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card">
                            <div class="body" style="padding-bottom: 0px;">
                                <form method="POST" action="{{ URL('/product') }}">
                                    {{ csrf_field() }}
                                <div class="row clearfix">
                                    <div class="col-sm-3">
                                        <div class="form-group" style="margin-bottom: 0px;">
                                            <div class="form-line">
                                                <select id="brand" name="brand" class="form-control show-tick">
                                                    <option value="">- All Brand -</option>
                                                    @foreach($brands as $brand)
                                                        @if($brand->id == $brandselect)
                                                            @php
                                                                $selected = "selected='selected'";
                                                            @endphp
                                                        @else
                                                            @php
                                                                $selected = "";
                                                            @endphp
                                                        @endif
                                                        <option {{$selected}} value="{{$brand->id}}">{{$brand->name}}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-5">
                                        <div class="form-group" style="margin-bottom: 0px;">
                                            <div class="form-line">
                                                <input type="text" class="form-control" name="namabarang" placeholder="Nama Barang" value="{{$namabarang}}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn bg-pink waves-effect btn-block">
                                            <i class="material-icons">search</i>
                                            <span>Cari</span>
                                        </button>
                                    </div>
                                    <!--<div class="col-sm-2">
                                        <a href="/product" class="btn bg-orange waves-effect btn-block">
                                            <i class="material-icons">undo</i>
                                            <span>Reset</span>
                                        </a>
                                    </div>-->
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card">
                            <div class="body">
                                <?php
                                //Columns must be a factor of 12 (1,2,3,4,6,12)
                                $numOfCols = 3;
                                $rowCount = 0;
                                $bootstrapColWidth = 12 / $numOfCols;
                                ?>
                                <div class="row">
                                    <?php
                                    foreach ($items as $item){
                                    ?>
                                    <div class="col-md-<?php echo $bootstrapColWidth; ?>">
                                        <div class="thumbnail">
                                            @if(file_exists(public_path('/images/product_thumb/'.$item->picture)))
                                                <a class="image-popup" href="{{ url('/images/product/'.$item->picture)}}">
                                                    <img src="{{ url('/images/product_thumb/'.$item->picture)}}">
                                                </a>
                                            @else
                                                <img src="{{ url('/images/product_thumb/no_image.jpg')}}">
                                            @endif
                                            <div class="caption">
                                                <h5>{{$item->name}} - {{$item->brands->name}}</h5>
                                                <div class="table-responsive">
                                                <table class="table table-bordered table-small">
                                                    <tbody>
                                                    <tr class="bg-pink">
                                                        <td>Uk</td>
                                                        <td>Stok</td>
                                                        <td>Harga</td>
                                                        <td>Berat</td>
                                                        <td>
                                                            Aksi
                                                        </td>
                                                    </tr>
                                                    @foreach($item->itemdetails as $itemDetail)
                                                        <tr>
                                                            <td align="center">{{$itemDetail->size}}</td>
                                                            <td align="center">{{$itemDetail->stock}}</td>
                                                            <td align="right">{{number_format($itemDetail->price,0,',','.')}}</td>
                                                            <td align="center">{{$itemDetail->weight}}</td>
                                                            <td><a class="btn btn-xs btn-info"
                                                                   onclick="pilihJumlahProduk({{$itemDetail->id.",".$itemDetail->stock}})">BELI</a>
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                    </tbody>
                                                </table>
                                                </div>
                                                @if(Auth::user()->detail->levels_id == "1")
                                                    <a href="{{ url('product/edit/'.$item->id)}}" class="btn btn-block btn-success waves-effect">
                                                        <i class="material-icons">mode_edit</i>
                                                        <span>EDIT PRODUK</span>
                                                    </a>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                    <?php
                                    $rowCount++;
                                    if($rowCount % $numOfCols == 0) echo '</div><div class="row">';
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </section>
    <div id="mJumlahProduk" class="modal fade">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-body">
                    <center>
                        <p>
                            <button style="width: 100%" onclick="beliProdukByJumlah(1)"
                                    class="btn bg-primary-300 btn-xlg">1 PCS
                            </button>
                        </p>
                        <p>
                            <button style="width: 100%" onclick="beliProdukByJumlah(5)" class="btn bg-primary btn-xlg">5
                                PCS
                            </button>
                        </p>
                        <p>
                            <button style="width: 100%" onclick="beliProdukByJumlah(10)"
                                    class="btn bg-primary-600 btn-xlg">10 PCS
                            </button>
                        </p>
                        <p>
                            <button style="width: 100%" onclick="beliProdukByJumlah(15)"
                                    class="btn bg-primary-700 btn-xlg">15 PCS
                            </button>
                        </p>
                        <p>
                            <button style="width: 100%" onclick="beliProdukByJumlah(20)"
                                    class="btn bg-primary-800 btn-xlg">20 PCS
                            </button>
                        </p>
                        <hr>
                        <p>
                        <div class="input-group">
                            <div class="form-line">
                                <input type="number" class="form-control" id="jumlahCustom"
                                       style="height: 42px !important; text-align: center;font-weight: bold; font-size: 20px;"
                                       name="jumlahCustom" value="1"></div>
                            <span class="input-group-addon" onclick="beliProdukByJumlahCustom()">
                            <button class="btn bg-pink waves-effect" style="width: 100%">BELI</button>
                            </span>
                        </div>
                        </p>
                        <p>

                            <a href="javacript:void(0)" style="width: 100%" class="btn btn-danger btn-xlg"
                               data-dismiss="modal">BATAL</a>
                        </p>
                    </center>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="idproduk">
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/product.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/product.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/product.js')}}"></script>
@stop


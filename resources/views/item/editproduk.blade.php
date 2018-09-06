@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>EDIT PRODUK</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            @if (\Session::has('success'))
                                <div class="row clearfix">
                                    <div class="col-lg-8 col-md-8 col-sm-6 col-xs-12">
                                        <div class="alert bg-green alert-dismissible" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                                                        aria-hidden="true">×</span></button>
                                            {{ \Session::get('success') }}
                                        </div>
                                    </div>
                                </div>
                            @endif
                                @foreach($data as $datas)
                            <form method="POST" id="frmFileUpload" action="{{ URL('edit-produk') }}" enctype="multipart/form-data">
                                @if ( count( $errors ) > 0 )
                                    @foreach ($errors->all() as $error)
                                        <div class="alert bg-pink alert-dismissible" role="alert">
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">×</span></button>
                                            {{ $error }}
                                        </div>
                                    @endforeach
                                @endif
                                {{ csrf_field() }}
                                    <input type="hidden" name="idproduk"  value="{{ $datas->id }}">
                                <div class="row clearfix">
                                    <div class="col-md-2">
                                        <label class="form-label">Kode</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" value="{{ $datas->code }}" id="code" name="code" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Nama</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="name" name="name" value="{{ $datas->name }}" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <div class="row clearfix">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label class="form-label">Brand</label>
                                                <div class="form-line">
                                                    <select id="brand" name="brand" class="form-control show-tick" required>
                                                        @foreach($brands as $brand)
                                                            @if($brand->id == $datas->brands_id)
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

                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label class="form-label">Gambar</label>
                                                <div class="form-line ">
                                                    <input name="gambar" type="file" class="form-control"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-8">
                                            <img class="img-responsive thumbnail" src="{{ url('/images/product/'.$datas->picture)}}">
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-8">
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>Size</th>
                                                    <th>Stok</th>
                                                    <th>Harga</th>
                                                    <th>Berat</th>
                                                    <th><button type="button" class="btn btn-success waves-effect add"><i class="material-icons">add</i>
                                                        </button>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody id="item_table">
                                                @php
                                                $i = 0; 
                                                @endphp
                                                @foreach($datas->itemdetails as $itemDetail)
                                                    <tr class="detail">
                                                        <td>
                                                            <div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="hidden" name="iddetail[]"  value="{{ $itemDetail->id }}">
                                                                    <input type="text" class="form-control" name="size[]" placeholder="Size" value="{{ $itemDetail->size }}">
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="text" class="form-control" name="stok[]" placeholder="Stok" value="{{ $itemDetail->stock }}">
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="text" class="form-control" name="harga[]" placeholder="Harga" value="{{ $itemDetail->price }}">
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="text" class="form-control" name="berat[]" placeholder="Berat" value="{{ $itemDetail->weight }}">
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            @if($i == 0)
                                                                @php
                                                                    $button = "";
                                                                @endphp
                                                            @else
                                                               <button type="button" class="btn bg-red btn-circle waves-effect waves-circle waves-float remove"><i class="material-icons">delete</i></button>';
                                                            @endif
                                                        </td>
                                                    </tr>
                                                    @php
                                                        $i++;
                                                    @endphp
                                                @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    
                                <button type="submit" class="btn btn bg-pink waves-effect waves-effect"><i class="material-icons">save</i>
                                    <span>SIMPAN PRODUK</span></button>
                            </form>
                                    @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/editproduk.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/editproduk.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/editproduk.js')}}"></script>
@stop

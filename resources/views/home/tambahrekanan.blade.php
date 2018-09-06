@extends('layout.template')
@section('content')
    <script>
        var level_user = '<?php echo Auth::user()->detail->levels_id;?>';
        var diskon_user = '<?php echo Auth::user()->detail->discount;?>';
    </script>
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>TAMBAH REKANAN</h2>
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
                            <form method="POST" id="simpan-rekanan" action="{{ URL('simpan-rekanan') }}">
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
                                <div class="row clearfix">
                                    <div class="col-md-3">
                                        <label class="form-label">Nama</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" required id="nama" name="nama" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Email</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" required id="email" name="email" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Password</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" required id="password" name="password" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-md-9">
                                        <div class="form-group">
                                            <label class="form-label">Alamat</label>
                                            <div class="form-line">
                                                <textarea rows="2" id="alamat" class="form-control no-resize" name="alamat"></textarea></div>
                                        </div>
                                    </div>
                                </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Propinsi</label>
                                                <div class="form-line">
                                                    <select class="form-control show-tick" id="propinsiPelanggan" name="propinsiPelanggan" data-live-search="true" required>
                                                    </select>
                                                    <input type="hidden" id="propinsiName"
                                                           name="propinsiName">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Kota</label>
                                                <div class="form-line">
                                                    <select id="kabupatenPelanggan" name="kabupatenPelanggan" class="form-control show-tick" data-live-search="true" required>
                                                    </select>
                                                    <input type="hidden" id="kabupatenName"
                                                           name="kabupatenName">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Telp</label>
                                                <div class="form-line">                                                <input type="text" id="telp" name="telp" class="form-control" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">BBM</label>
                                                <div class="form-line">                                                <input type="text" id="bbm" name="bbm" class="form-control" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">LINE</label>
                                                <div class="form-line">                                                <input type="text" id="line" name="line" class="form-control" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">WA</label>
                                                <div class="form-line">                                                <input type="text" id="wa" name="wa" class="form-control" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-9">
                                            <div class="form-group">
                                                <label class="form-label">WA Template</label>
                                                <div class="form-line">
                                                    <textarea rows="2" id="watemplate" class="form-control no-resize" name="watemplate"></textarea></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Level</label>
                                                <div class="form-line">
                                                    <select id="level" name="level" class="form-control show-tick" required>
                                                        @if(Auth::user()->detail->levels_id == "1")
                                                        <option value="2">Reseller</option>
                                                        <option value="3">Marketer</option>
                                                        @elseif(Auth::user()->detail->levels_id == "2")
                                                            <option value="3">Marketer</option>
                                                        @endif
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Diskon</label>
                                                <div class="form-line">
                                                    <input type="text" id="diskon" name="diskon" class="form-control" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <br>
                                <button type="button" id="save-rekanan" class="btn btn bg-pink waves-effect waves-effect"><i class="material-icons">save</i><span>SIMPAN REKANAN</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/tambahrekanan.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/tambahrekanan.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/tambahrekanan.js')}}"></script>
@stop

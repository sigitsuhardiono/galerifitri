@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>EDIT MARKETER</h2>
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
                            <form method="POST" action="{{ URL('edit-marketer') }}">
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
                                    <input type="hidden" id="idmarketer" name="idmarketer" class="form-control" value="{{ $datas->id }}">
                                    <div class="row clearfix">
                                    <div class="col-md-3">
                                        <label class="form-label">Nama</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="nama" name="nama" class="form-control" value="{{ $datas->name }}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Email</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="email" name="email" class="form-control" value="{{ $datas->email }}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Password</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="password" name="password" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-md-9">
                                        <div class="form-group">
                                            <label class="form-label">Alamat</label>
                                            <div class="form-line">
                                                <textarea rows="2" id="alamat" class="form-control no-resize" name="alamat">{{ $datas->detail->address }}</textarea></div>
                                        </div>
                                    </div>
                                </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Propinsi</label>
                                                <div class="form-line">
                                                    <select class="form-control show-tick" id="propinsiPelanggan" name="propinsiPelanggan" required>
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
                                                    <select id="kabupatenPelanggan" name="kabupatenPelanggan" class="form-control show-tick" required>
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
                                                <div class="form-line">                                                <input type="text" id="telp" name="telp" class="form-control" value="{{ $datas->detail->phone }}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">BBM</label>
                                                <div class="form-line">                                                <input type="text" id="bbm" name="bbm" class="form-control" value="{{ $datas->detail->bbm }}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">LINE</label>
                                                <div class="form-line">                                                <input type="text" id="line" name="line" class="form-control" value="{{ $datas->detail->line }}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">WA</label>
                                                <div class="form-line">                                                <input type="text" id="wa" name="wa" class="form-control" value="{{ $datas->detail->wa }}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-9">
                                            <div class="form-group">
                                                <label class="form-label">WA Template</label>
                                                <div class="form-line">
                                                    <textarea rows="2" id="watemplate" class="form-control no-resize" name="watemplate">{{ $datas->detail->wa_template }}</textarea></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row clearfix">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label class="form-label">Diskon</label>
                                                <select id="diskon" name="diskon" class="form-control show-tick" required>
                                                    <option value="10">10 %</option>
                                                </select>
                                                </div>
                                        </div>
                                    </div>
                                <br>
                                <button type="submit" class="btn btn-primary m-t-15 waves-effect">SIMPAN</button>
                            </form>
                                    <script>
                                        var ID_PROVINCE = '{{ $datas->detail->provinces_id }}';
                                        var ID_CITY = '{{ $datas->detail->citys_id }}';
                                    </script>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/editmarketer.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/editmarketer.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/editmarketer.js')}}"></script>
@stop

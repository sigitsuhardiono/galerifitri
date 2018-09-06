@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>ISI DEPOSIT</h2>
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
                            <form method="POST" action="{{ URL('simpan-deposit') }}">
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
                                    <div class="col-md-4">
                                        <label class="form-label">User</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <select class="form-control show-tick" id="userId" name="userId"data-live-search="true">
                                                @foreach ($pelanggan as $pel)
                                                    <option value="{{$pel->id}}">{{$pel->name}}</option>
                                                    @endforeach   
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-md-4">
                                        <label class="form-label">Nominal</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="nominal" name="nominal" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-md-4">
                                        <label class="form-label">Tgl Transfer</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="tgltransfer" name="tgltransfer" class="form-control date">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Tgl Approve</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="tglapprove" name="tglapprove" class="form-control date">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="form-label">Keterangan</label>
                                            <div class="form-line">
                                                <textarea rows="2" id="note" class="form-control no-resize" name="note"></textarea></div>
                                        </div>
                                    </div>
                                </div>

                                <br>
                                <button type="submit" class="btn btn-primary m-t-15 waves-effect">SIMPAN</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/isideposit.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/isideposit.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/isideposit.js')}}"></script>
@stop

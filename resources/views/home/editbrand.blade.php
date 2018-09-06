@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>EDIT BRAND</h2>
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
                                <form method="POST" action="{{ URL('edit-brand') }}">
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
                                    <input type="hidden" id="idbrand" name="idbrand" class="form-control" value="{{ $datas->id }}">
                                    <div class="row clearfix">
                                    <div class="col-md-3">
                                        <label class="form-label">Nama</label>
                                        <div class="form-group">
                                            <div class="form-line">
                                                <input type="text" id="nama" name="nama" class="form-control" value="{{ $datas->name }}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="btn bg-orange waves-effect">
                                    <i class="material-icons">save</i>
                                    <span>Simpan Brand</span>
                                </button>
                            </form>
                                @endforeach;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
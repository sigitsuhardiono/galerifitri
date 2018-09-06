@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>PROFILE</h2>
            </div>
            <!-- Widgets -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <form class="form-horizontal">
                                <div class="row clearfix">
                                    <div class="col-md-6">
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="name">Name</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->name}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="email">Email</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->email}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="address">Address</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->detail->address}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="wa">WA</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->detail->wa}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="wa">WA Message</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->detail->wa_template}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="wa">BBM</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->detail->bbm}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-5 form-control-label">
                                                <label for="wa">LINE</label>
                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-7">
                                                <div class="form-group">
                                                    <div class="form-line">
                                                        <input type="text" value="{{Auth::user()->detail->line}}" id="name" class="form-control">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="row clearfix">
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div id="block-note">
                                                    <br><br>
                                                    ♥ Cara Belinya Gimana ? Atau Mau Nanya Nanya Dulu.. ?<br>
                                                    Boleh Langsung di bawah ini ya bunda...<br>
                                                    .<br>
                                                    .<br>
                                                    ♥ SMS / WA : 085222222222<br>
                                                    atau Langsung Klik Link di bawah untuk ke Admin WhatsApp
                                                    <br>
                                                    <br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #END# Widgets -->
        </div>
    </section>
@stop

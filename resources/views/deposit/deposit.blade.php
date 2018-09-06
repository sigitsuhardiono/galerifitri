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
                                        <table class="table table-xlg text-nowrap" style="background: #FFF">
                                            <tbody>
                                            <tr>
                                                <td class="col-md-3 text-center">
                                                    <div style="display:block;margin: 0 auto;width: 220px;" class="alert alert-info">
                                                        <div class="media-left media-middle">
                                                            <a href="#" class="btn border-indigo-400 text-indigo-400 btn-flat btn-rounded btn-xs btn-icon">
                                                                <i class=" icon-wallet"></i>
                                                            </a>
                                                        </div>

                                                        <div class="media-left">
                                                            <h5 class="text-semibold no-margin">
                                                                <small class="display-block no-margin text-semibold" style="color: #000">total dompet</small>
                                                                Rp. 0,00

                                                            </h5>
                                                        </div>
                                                    </div>
                                                </td>


                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label class="col-lg-1 control-label">Cari</label>
                                            <div class="col-lg-11">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <input type="text" placeholder="Masukkan Keyword" class="form-control" id="keyword">
                                                    </div>
                                                    <div class="col-md-9">
                                                        <a href="#" onclick="reloadData()" data-toggle="tooltip" title="Edit" class="btn btn-xs btn-primary"><i class="fa fa-search"></i> Cari Data</a>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="table-responsive">
                                <table id="js-history" class="table table-bordered table-striped table-hover dataTable js-history">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tanggal Transfer</th>
                                        <th>Nilai</th>
                                        <th>Keterangan</th>
                                        <th>Tanggal Approval</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tanggal Transfer</th>
                                        <th>Nilai</th>
                                        <th>Keterangan</th>
                                        <th>Tanggal Approval</th>
                                        <th>Action</th>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
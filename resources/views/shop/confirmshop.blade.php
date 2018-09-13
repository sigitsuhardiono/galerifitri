@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>KONFIRMASI PEMBAYARAN</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <div class="row clearfix">
                                <div class="col-md-8 col-md-push-2">
                                    @if (\Session::has('success'))
                                        <div class="row">
                                            <div class="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                                                <div class="alert bg-green alert-dismissible" role="alert">
                                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                                                                aria-hidden="true">×</span></button>
                                                    {{ \Session::get('success') }}
                                                </div>
                                            </div>
                                        </div>
                                    @endif
                                    @if ($shops->status == "0")
                                    <center>
                                        <span class="text-large label label-primary"
                                              style="font-size: 15px;">{{$shops->code}}</span>
                                    </center>
                                    <div class="text-semibold text-center"
                                         style="padding-bottom: 6px;padding-top: 6px;">Jumlah yang harus konfirmasi :
                                    </div>
                                    <div class="text-semibold text-center"
                                         style="font-size: 30px;">{{number_format($shops->price_final,0,',','.')}}</div>
                                    <br>
                                    <div class="text-large text-light">
                                        <ul>
                                            <li>Pastikan Dompet Anda Mencukupi Sebelum Melakukan Proses Konfirmasi</li>
                                            <li><a href="{{url('deposit')}}" class="text-black"
                                                   target="_top">Klik Disini</a> untuk mengecek ketersediaan dompet
                                            </li>
                                        </ul>
                                    </div>
                                    <br>
                                    <div class="col-sm-12">
                                        <div class="text-center text-semibold text-danger" style="padding-top: 10px">
                                            <div style="padding-bottom: 10px;display: block">
                                                Pastikan anda melakukan konfirmasi sebelum waktu dibawah,<br>
                                                melebihi waktu tersebut transaksi akan terbatalkan secara otomatis
                                            </div>
                                            @php
                                                $timezone = new DateTimeZone('Asia/Jakarta');
                                                $date = new DateTime($shops->limited_at);
                                                $date->setTimeZone($timezone);
                                            @endphp
                                            <span class="label label-danger" style="font-size: 15px;">{{$date->format('d-M-Y H:i:s')}}</span>
                                            <br>
                                            <a style="margin-top: 10px;text-decoration: none;cursor: pointer;"
                                               data-toggle="modal" data-target="#konfirmasiTransaksi" target="_top"><h3><span class='label label-primary'>KONFIRMASI TRANSAKSI</span></h3></a>
                                        </div>
                                    </div>
                                    <br>
                                    <br>
                                        @endif
                                        @if ($shops->status == "1")
                                        <div class="col-sm-12">
                                            <div class="text-center text-semibold text-danger" style="padding-top: 10px"><h3><span class='label label-primary'>TRANSAKSI SUDAH TERKONFIRMASI</span></h3>
                                            </div>
                                        </div>
                                        @endif
                                </div>
                                <div class="col-md-12">
                                    <form class="form-horizontal form">
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-2 h6 control-label" for="example-hf-email">Nama Pelanggan : </label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="namaCaption">{{$shops->customers->name}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-2 h6 control-label" for="example-hf-email">No. Handphone : </label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="hpCaption">{{$shops->receiver_phone}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-2 h6 control-label" for="example-hf-email">Alamat Pelanggan :</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="alamatCaption">{{$shops->receiver_address}}&nbsp;
                                                <span class="text-semibold">{{$shops->receiver_province_name}}, {{$shops->receiver_city_name}}</span>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-2 h6 control-label" for="example-hf-email">Ekspedisi : </label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="eksCaption">
                                                {{strtoupper($shops->send_courier)}} - {{$shops->send_service}}
                                            </div>
                                        </div>
                                    </form>
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-striped" style="font-size: 11px">
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nama Produk</th>
                                                <th class="text-center ">Jumlah</th>
                                                <th class="text-right">Harga</th>
                                                <th class="text-right">Sub Total</th>
                                                <th class="text-right">Diskon</th>
                                                <th class="text-right">Total</th>
                                                <th class="text-right">Berat</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            @php
                                                $i=0;
                                                $totalTransaksi = 0;
                                                $totalDiskon = 0;
                                                $totalBerat = 0;
                                            @endphp
                                            @foreach($shopsdetail->shopdetails as $dtDetail)
                                                @php
                                                    $i++;
                                                    $id  = $dtDetail->id;
                                                    $nama  = $dtDetail->items_name;
                                                    $hargaJual  =$dtDetail->items_price;
                                                    $qty  = $dtDetail->qty;
                                                    $diskonRupiah = $dtDetail->discount_rupiah;
                                                    $berat = $dtDetail->weight;
                                                    $subTotal = $hargaJual*$qty;
                                                    $subDiskon = $diskonRupiah*$qty;
                                                    $subBerat = $berat*$qty;
                                                    $total = $subTotal-$subDiskon;
                                                    $totalTransaksi += $total;
                                                    $totalDiskon += $subDiskon;
                                                    $totalBerat+=$subBerat;
                                                @endphp
                                                <tr>
                                                    <td>{{$i}}<input type="hidden" value="{{$dtDetail->items_id}}"></td>
                                                    <td>
                                                        {{$nama}}
                                                    </td>
                                                    <td class="text-center " nowrap="">
                                                        {{$qty}}
                                                    </td>
                                                    <td class="text-right" nowrap="">
                                                        Rp. {{number_format($hargaJual,0,',','.')}}</td>
                                                    <td class="text-right" nowrap="">
                                                        Rp. {{number_format(($subTotal),0,',','.')}}</td>
                                                    <td class="text-right" nowrap="">
                                                        Rp. {{number_format(($subDiskon),0,',','.')}}</td>
                                                    <td class="text-right" nowrap="">
                                                        Rp. {{number_format(($total),0,',','.')}}</td>
                                                    <td class="text-right"
                                                        nowrap="">{{number_format(($subBerat),0,',','.')}}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td></td>
                                                <td colspan="5" class="text-right text-semibold">Total Transaksi :</td>
                                                <td class="text-right " nowrap="">Rp. {{number_format(($totalTransaksi),0,',','.')}}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td colspan="5" class="text-right text-semibold">Total Diskon Bunda :
                                                </td>
                                                <td class="text-right " nowrap="">Rp. {{number_format(($totalDiskon),0,',','.')}}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td colspan="5" class="text-right text-semibold">Ongkos Kirim :</td>
                                                <td class="text-right " id="totalOngkosKirim" nowrap="">Rp. {{number_format(($shops->send_price),0,',','.')}}</td>
                                                <td class="text-right ">{{$totalBerat}} gr</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td colspan="5" class="text-right text-semibold">Grand Total (Transaksi
                                                    + Ongkir) :
                                                </td>
                                                <td class="text-right " id="grandTotal" nowrap="">
                                                    Rp. {{number_format(($totalTransaksi+$shops->send_price),0,',','.')}}
                                                </td>
                                                <td></td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="konfirmasiTransaksi" class="modal fade">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h5 class="modal-title">Konfirmasi Transaksi</h5>

                        </div>

                        <div class="modal-body">
                            <h6 class="text-semibold">Anda Yakin akan melakukan Proses Konfirmasi ?</h6>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-link" data-dismiss="modal">Tutup</button>
                            <button type="button" class="btn btn-primary" onclick="konfirmasiTransfer();">Proses</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
@stop
<script type="text/javascript">
    var ID_TRANS = '{{$shops->id}}';
</script>
@section('plugin-css')
    <link href="{{mix('plugin/css/confirm-trans.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/confirm-trans.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/confirm-trans.js')}}"></script>
@stop

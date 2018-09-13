@extends('layout.template')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2>DETAIL KERANJANG</h2>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                                @if($items)
                                <div class="stepwizard">
                                    <div class="stepwizard-row setup-panel">
                                        <div class="stepwizard-step">
                                            <a href="#step-1" type="button" class="btn btn-primary btn-circle-step" style="border-radius: 50%;">1</a>
                                            <p style="margin-top: 10px;">Keranjang Belanja</p>
                                        </div>
                                        <div class="stepwizard-step">
                                            <a href="#step-2" type="button" class="btn btn-default btn-circle-step" disabled="disabled" style="border-radius: 50%;">2</a>
                                            <p style="margin-top: 10px;">Data Pelanggan</p>
                                        </div>
                                        <div class="stepwizard-step">
                                            <a href="#step-3" type="button" class="btn btn-default btn-circle-step" disabled="disabled" style="border-radius: 50%;">3</a>
                                            <p style="margin-top: 10px;">Konfirmasi Transaksi</p>
                                        </div>
                                    </div>
                                </div>

                                <form action="{{ URL('simpan-transaksi') }}" method="POST" style="border: 1px solid #ddd;padding: 16px;margin-top: 20px;">
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
                                    <div class="row setup-content" id="step-1">
                                        <div class="col-md-12">
                                            <div class="col-md-12">
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
                                                        @foreach($items as $item)
                                                            @php
                                                                $i++;
                                                                $id  = $item["id"];
                                                                $nama  = $item["nama"];
                                                                $hargaJual  = $item["hargajual"];
                                                                $qty  = $item["qty"];
                                                                $diskonRupiah = $item["diskon_rupiah"];
                                                                $berat = $item["berat"];
                                                                $subTotal = $hargaJual*$qty;
                                                                $subDiskon = $diskonRupiah*$qty;
                                                                $subBerat = floatval($berat)* floatval($qty);
                                                                $total = $subTotal-$subDiskon;
                                                                $totalTransaksi += $subTotal;
                                                                $totalDiskon += $subDiskon;
                                                                $totalBerat+=floatval($subBerat);
                                                            @endphp
                                                            <tr>
                                                                <td>{{$i}}</td>
                                                                <td style="white-space:normal">{{$nama}}</td>
                                                                <td class="text-center " style="width: 100px" nowrap="">
                                                                    <div class="input-group">
                                                                        <input type="text" onchange="recalculate({{$id}})"
                                                                               id="jumlah_{{$id}}"
                                                                               style="width: 60px;font-size: 10px" value="{{$qty}}"
                                                                               class="touchspin-data text-center" readonly="true">
                                                                        <div class="input-group-btn">
                                                                            <a class="btn  btn-danger"
                                                                               onclick="hapusData({{$id}})">del</a>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td class="text-right" nowrap="">
                                                                    Rp {{number_format($hargaJual,0,',','.')}}</td>
                                                                <td class="text-right" nowrap="">
                                                                    Rp {{number_format($subTotal,0,',','.')}}
                                                                </td>

                                                                <td class="text-right"
                                                                    nowrap="">Rp {{number_format($subDiskon,0,',','.')}}</td>
                                                                <td class="text-right"
                                                                    nowrap="">Rp {{number_format($total,0,',','.')}}</td>
                                                                <td class="text-right" nowrap="">{{$subBerat}}</td>
                                                            </tr>
                                                        @endforeach
                                                        </tbody>
                                                        <tfoot>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Total Transaksi :</td>
                                                            <td class="text-right " nowrap="">
                                                                Rp {{number_format($totalTransaksi,0,',','.')}}</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Total Diskon :
                                                            </td>
                                                            <td class="text-right " nowrap="">
                                                                Rp {{number_format($totalDiskon,0,',','.')}}</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Total Berat (Gr) :</td>
                                                            <td class="text-right "
                                                                nowrap="">{{$totalBerat}}</td>
                                                            <td>
                                                                <input type="hidden" id="total_transaksi" name="total_transaksi"
                                                                       value="{{$totalTransaksi}}">
                                                                <input type="hidden" id="total_diskon" name="total_diskon"
                                                                       value="{{$totalDiskon}}">
                                                                <input type="hidden" id="kabupatenAsal"
                                                                       value="{{Auth::user()->detail->citys_id}}"><input
                                                                        type="hidden" id="beratKiriman" value="{{$totalBerat}}"></td>
                                                        </tr>

                                                        </tfoot>
                                                    </table>

                                                </div>

                                                <button class="btn btn-primary nextBtn btn-lg pull-right" type="button" >Next</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row setup-content" id="step-2">
                                        <div class="col-md-12">
                                            <div class="col-md-12">
                                                <div class="row clearfix">
                                                    <div class="col-md-6">
                                                        <label class="form-label">{{ __('Nama Pengirim') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <input type="text" name="namaPengirim" class="form-control" required
                                                                       value="{{Auth::user()->name}}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <button type="button" class="btn bg-teal waves-effect"  onclick="newCustomer()">
                                                            <i class="material-icons">contacts</i>
                                                            <span>Pelanggan <Baru></Baru></span>
                                                        </button>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label class="form-label">{{ __('Nama Pelanggan') }}</label>
                                                            <div class="form-line">
                                                                <select class="form-control show-tick" id="namaPelangganDrop" name="namaPelangganDrop" data-live-search="true" required>
                                                                </select>
                                                                <input type="hidden" id="propinsiName"
                                                                       name="propinsiName">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label">{{ __('HP pelanggan') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <input type="text" id="telpPelanggan" name="telpPelanggan" class="form-control" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-6">
                                                        <label class="form-label">{{ __('Alamat') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <textarea name="alamatPelanggan" id="alamatPelanggan" cols="30" rows="3" class="form-control no-resize"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-3">
                                                        <label class="form-label">{{ __('Propinsi') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <select class="form-control show-tick" id="propinsiPelanggan" name="propinsiPelanggan" data-live-search="true" required>
                                                                </select>
                                                                <input type="hidden" id="propinsiNamePelanggan"
                                                                       name="propinsiNamePelanggan">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label class="form-label">{{ __('Kabupaten') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <select id="kabupatenPelanggan" name="kabupatenPelanggan" class="form-control show-tick" data-live-search="true" required>
                                                                </select>
                                                                <input type="hidden" id="kabupatenNamePelanggan"
                                                                       name="kabupatenNamePelanggan">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Pilih ekpedisi') }}</label>
                                                        <div class="table-responsive">
                                                            <table class="table table-bordered table-small table-ekspedisi">
                                                                <thead>
                                                                <tr>
                                                                    <td class="text-center">#</td>
                                                                    <td class="text-center">Jenis</td>
                                                                    <td class="5%">Tipe</td>
                                                                    <td>Detail Kurir</td>
                                                                    <td class="text-right">Harga</td>
                                                                    <td class="text-center">ETD</td>
                                                                </tr>
                                                                </thead>
                                                                <tbody id="detailKurir" class="table-small">
                                                                <tr>
                                                                    <td colspan="6"> Pilih Kota Pengiriman</td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-6">
                                                        <label class="form-label">{{ __('Catatan tambahan') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                    <textarea name="note" cols="30" rows="3"
                                                              class="form-control no-resize"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-6">
                                                        <label class="form-label">{{ __('Ongkos kirim') }}</label>
                                                        <div class="row clearfix">
                                                            <div class="col-md-6">
                                                                <div class="form-group form-float">
                                                                    <div class="form-line">
                                                                        <input type="text" readonly name="ongkosKirimS" id="ongkosKirimS"
                                                                               class="form-control" required>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div class="col-md-6">
                                                                <div class="form-group form-float">
                                                                    <div class="form-line">
                                                                        <input type="text" readonly name="ongkosKirimF" id="ongkosKirimF"
                                                                               class="form-control" required>
                                                                    </div>
                                                                </div>
                                                                <input type="hidden" id="ongkosKirim" name="ongkosKirim">
                                                                <input type="hidden" id="ongkosKirimService"
                                                                       name="ongkosKirimService">
                                                                <input type="hidden" id="courier" name="courier">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <button class="btn btn-primary nextBtn btn-lg pull-right" type="button" >Next</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row setup-content" id="step-3">
                                        <div class="col-md-12">
                                            <div class="col-md-12">
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
                                                        @foreach($items as $item)
                                                            @php
                                                                $i++;
                                                                $id  = $item["id"];
                                                                $nama  = $item["nama"];
                                                                $hargaJual  = $item["hargajual"];
                                                                $qty  = $item["qty"];
                                                                $diskonRupiah = $item["diskon_rupiah"];
                                                                $berat = $item["berat"];
                                                                $subTotal = $hargaJual*$qty;
                                                                $subDiskon = $diskonRupiah*$qty;
                                                                $subBerat = $berat*$qty;
                                                                $total = $subTotal-$subDiskon;
                                                                $totalTransaksi += $subTotal;
                                                                $totalDiskon += $subDiskon;
                                                                $totalBerat+=$subBerat;
                                                            @endphp
                                                            <tr>
                                                                <td>{{$i}}</td>
                                                                <td style="white-space:normal">{{$nama}}</td>
                                                                <td class="text-center " nowrap="">{{$qty}}</td>
                                                                <td class="text-right" nowrap="">
                                                                    Rp {{number_format($hargaJual,0,',','.')}}</td>
                                                                <td class="text-right" nowrap="">
                                                                    Rp {{number_format($subTotal,0,',','.')}}
                                                                </td>

                                                                <td class="text-right"
                                                                    nowrap="">Rp {{number_format($subDiskon,0,',','.')}}</td>
                                                                <td class="text-right"
                                                                    nowrap="">Rp {{number_format($total,0,',','.')}}</td>
                                                                <td class="text-right" nowrap="">{{$subBerat}}</td>
                                                            </tr>
                                                        @endforeach
                                                        </tbody>
                                                        <tfoot>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Total Transaksi :</td>
                                                            <td class="text-right " nowrap="">
                                                                Rp {{number_format($totalTransaksi,0,',','.')}}</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Total Diskon :
                                                            </td>
                                                            <td class="text-right " nowrap=""><input type="hidden" id="totalTransaksi" name="totalTransaksi" value="{{$totalTransaksi}}"><input type="hidden" id="totalDiskon" name="totalDiskon" value="{{$totalDiskon}}"><input type="hidden" id="totalBayar" name="totalBayar" value="{{$totalTransaksi-$totalDiskon}}">
                                                                Rp {{number_format($totalDiskon,0,',','.')}}</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Ongkos Kirim :</td>
                                                            <td class="text-right " id="totalOngkosKirim">Rp. 25,500</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="5" class="text-right text-semibold">Grand Total :</td>
                                                            <td class="text-right " id="grandTotal">Rp. 312,600</td>
                                                            <td></td>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>

                                                <button class="btn btn-success btn-lg pull-right" type="submit">Check out</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>





                            
                            <div id="mNewCustomer" class="modal fade">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <form class="form" action="#" id="frmPelanggan">
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Nama Pelanggan *') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <input type="text" name="nama_pelanggan_new"
                                                                       class="form-control" required value=""
                                                                       id="nama_pelanggan_new">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Handphone Pelanggan *') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <input type="number" id="no_handphone_new"
                                                                       name="no_handphone_new" class="form-control"
                                                                       required placeholder="Masukkan No. Handphone">
                                                            </div>
                                                        </div>
                                                        <span class="help-block">Masukkan hanya angka saja, diawali dengan 62 jika nomor indonesia,tanpa spasi maupun tanda (-), digunakan untuk follow up lewat whatsapp
							<br><b>contoh : 62817100141</b></span>

                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Alamat * ') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <textarea id="alamat_new" name="alamat_new" class="form-control" rows="5" required placeholder="Masukkan Alamat "></textarea>
                                                            </div>
                                                        </div>
                                                        <span class="help-block">Masukkan alamat selengkap mungkin</span>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Propinsi *') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <select class="form-control show-tick" name='idpropinsi' id='idpropinsi' required  class=' select'></select>
                                                                <input type="hidden" id="propinsiNameModal" name="propinsiNameModal" value="">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <label class="form-label">{{ __('Kabupaten *') }}</label>
                                                        <div class="form-group form-float">
                                                            <div class="form-line">
                                                                <select class="form-control show-tick" name='idkabupaten' id='idkabupaten' required  class=' select'></select>
                                                                <input type="hidden" id="kabupatenNameModal" name="kabupatenNameModal" value="">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="col-md-12">
                                                        <input type="button" class="btn btn-lg btn-danger"
                                                               value="Batal" data-dismiss="modal">
                                                        <input type="button" class="btn btn-lg btn-primary"
                                                               value="Simpan" id="simpanPelanggan"
                                                               onclick="saveNewCustomer()">
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @else
                                <div class="alert bg-red">
                                    Keranjang Kosong
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop
@section('plugin-css')
    <link href="{{mix('plugin/css/detailcart.css')}}" rel="stylesheet">
@stop

@section('plugin-js')
    <script src="{{mix('plugin/js/detailcart.js')}}"></script>
@stop

@section('pages-js')
    <script src="{{mix('js/pages/detailcart.js')}}"></script>
@stop


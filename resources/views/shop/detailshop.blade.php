        <div class="container-fluid">

                            <div class="row clearfix">
                                <form class="form-horizontal form">
                                    <div class="col-md-6">
                                            <div class="form-group">
                                                <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-4 h6 control-label" for="example-hf-email">Nama Pelanggan</label>
                                                <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="namaCaption">{{$shops->customers->name}}</div>
                                            </div>
                                            <div class="form-group">
                                                <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-4 h6 control-label" for="example-hf-email">No. Handphone</label>
                                                <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="hpCaption">{{$shops->receiver_phone}}</div>
                                            </div>
                                            <div class="form-group">
                                                <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-4 h6 control-label" for="example-hf-email">Alamat Pelanggan</label>
                                                <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="alamatCaption">{{$shops->receiver_address}}&nbsp;
                                                    <span class="text-semibold">{{$shops->receiver_province_name}}, {{$shops->receiver_city_name}}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-4 h6 control-label" for="example-hf-email">Ekspedisi</label>
                                                <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="eksCaption">
                                                    {{strtoupper($shops->send_courier)}} - {{$shops->send_service}}
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-4 h6 control-label" for="example-hf-email">No Resi</label>
                                                <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-8 h6 form-control-static text-black" id="eksCaption">
                                                    {{$shops->no_resi}}
                                                </div>
                                            </div>
                                    </div>
                                    <div class="col-md-6">
                                        @php
                                            $timezone = new DateTimeZone('Asia/Jakarta');
                                            $dateKonfirm = "-";
                                            $dateBayar = "-";
                                            $datePrint = "-";
                                            $dateKirim = "-";
                                            $dateInputResi = "-";
                                            if($shops->confirm_at){
                                                $dateKonfirm = new DateTime($shops->confirm_at);
                                                $dateKonfirm->setTimeZone($timezone);
                                                $dateKonfirm = $dateKonfirm->format('d-M-Y H:i:s');
                                            }
                                            if($shops->payment_at){
                                                $dateBayar = new DateTime($shops->payment_at);
                                                $dateBayar->setTimeZone($timezone);
                                                $dateBayar = $dateBayar->format('d-M-Y H:i:s');
                                            }
                                            if($shops->print_at){
                                                $datePrint = new DateTime($shops->print_at);
                                                $datePrint->setTimeZone($timezone);
                                                $datePrint = $datePrint->format('d-M-Y H:i:s');
                                            }
                                            if($shops->send_at){
                                                $dateKirim = new DateTime($shops->send_at);
                                                $dateKirim->setTimeZone($timezone);
                                                $dateKirim = $dateKirim->format('d-M-Y H:i:s');
                                            }
                                            if($shops->airbill_at){
                                                $dateInputResi = new DateTime($shops->airbill_at);
                                                $dateInputResi->setTimeZone($timezone);
                                                $dateInputResi = $dateInputResi->format('d-M-Y H:i:s');
                                            }
                                        @endphp
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 control-label">Tanggal Konfirm</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 form-control-static text-black">{{$dateKonfirm}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 control-label">Tanggal Bayar</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 form-control-static text-black">{{$dateBayar}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 control-label">Tanggal Print Label</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 form-control-static text-black">{{$datePrint}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 control-label">Tanggal Kirim</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 form-control-static text-black">{{$dateKirim}}</div>
                                        </div>
                                        <div class="form-group">
                                            <label style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 control-label">Tanggal Input Resi</label>
                                            <div style="margin-bottom: 0px;margin-top: 0px;" class="col-md-6 h6 form-control-static text-black">{{$dateInputResi}}</div>
                                        </div>
                                    </div>
                                </form>
                                
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

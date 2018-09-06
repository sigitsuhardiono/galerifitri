<link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
<style>
    body{
        margin: 0;
        font-family: 'Roboto Mono', monospace;
    }
</style>
@php
    $timezone = new DateTimeZone('Asia/Jakarta');
    $date = new DateTime($shops->created_at);
    $date->setTimeZone($timezone);
@endphp
@php
    $i=0;
    $hrg = 0;
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
        $hrg += $subTotal;
        $totalTransaksi += $total;
        $totalDiskon += $subDiskon;
        $totalBerat+=$subBerat;
    @endphp
@endforeach

<table border="1" cellspacing="0" cellpadding="0" width="60%" style="border-collapse:collapse;border: 1px solid #989494">
    <tr style="background-color:#f5d2b3;" >
        <td width="70%" align="right" style="padding: 10px">{{$shops->send_service}}</td>
        <td width="30%" style="padding: 10px">Berat {{$totalBerat}} g</td>
    </tr>
    <tr>
        <td colspan="2"  width="100%" style="padding: 10px">
            <div>
                <p style="font-size: 12px;margin-bottom:5px">Kepada</p>
                <p style="font-size: 20px;margin-top:5px;margin-bottom:5px">{{$shops->receiver_name}}</p>
                <p style="font-size: 14px;margin-top:5px;margin-bottom:5px">{{$shops->receiver_phone}}</p>
                <p style="font-size: 14px;margin-top:5px;margin-bottom:5px">{{$shops->receiver_address}} {{$shops->receiver_province_name}}, {{$shops->receiver_city_name}}</p>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2"  width="100%" style="padding: 10px">
            <div>
                <p style="font-size: 12px;margin-bottom:5px">Dari</p>
                <p style="font-size: 20px;margin-top:5px;margin-bottom:5px">Galeri Fitri</p>
                <p style="font-size: 14px;margin-top:5px;margin-bottom:5px">081336419207</p>
            </div>
        </td>
    </tr>
</table>
<table border="1" cellspacing="0" cellpadding="0" width="60%" style="margin-top: 20px; border-collapse:collapse;font-size: 10px;border: 1px solid #989494"">
    <tr style="border: none;background-color:#94deff;">
        <td width="20%" style="border: none;padding: 10px">
            <div>WA @galeryfitri</div>
        </td>
        <td width="20%" style="border: none;"><div>FB fb.me/galerifitri</div></td>
        <td width="20%" style="border: none;"><div>IG @galeryfitri</div></td>
        <td width="20%" style="border: none;"><div>Line 085233330128</div></td>
    </tr>
</table>
<table border="1" cellspacing="0" cellpadding="0" width="60%" style="margin-top: 20px;border-collapse:collapse;border: 1px solid #989494">
    <tr style="background-color:#f7f4a5;" >
        <td width="50%" style="padding: 5px">{{$shops->send_service}}</td>
        <td width="50%" style="padding: 5px">{{$date->format('d-M-Y')}}</td>
    </tr>
    <tr>
        <td colspan="2"  width="100%" style="padding: 10px">
            <div>
                <p style="font-size: 12px;margin-bottom:5px">Kepada : {{$shops->customers->name}} ({{$shops->receiver_phone}})</p>
                <p style="font-size: 12px;margin-top:5px;margin-bottom:5px">{{$shops->receiver_address}} {{$shops->receiver_province_name}}, {{$shops->receiver_city_name}}</p>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <p style="font-size: 12px;padding-left: 10px;padding-top: 5px;padding-bottom: 5px;">Dari : Galeri Fitri</p>
        </td>
        <td rowspan="5" valign="top">
            @foreach($shopsdetail->shopdetails as $dtDetail)
                <p style="font-size: 12px;padding-left: 10px;padding-top: 5px;padding-bottom: 5px;margin-bottom: 0px;">{{$dtDetail->items_name}}</p>
            @endforeach
        </td>
    </tr>
    <tr>
        <td>
            <p style="font-size: 12px;margin-bottom: 0px;padding-left: 10px;padding-top: 5px;">Harga : {{number_format($hrg,0,',','.')}} - {{number_format($totalDiskon,0,',','.')}} </p>
            <p style="font-size: 12px;margin-bottom: 0px;padding-left: 10px;padding-top: 0px;margin-top: 5px;padding-bottom: 5px;">Total Pesanan : {{number_format($totalTransaksi,0,',','.')}}</p>
        </td>
    </tr>
    <tr>
        <td>
            <p style="font-size: 12px;padding-left: 10px;padding-top: 5px;padding-bottom: 5px;">Ongkir ({{$shops->send_service}}) : {{number_format($shops->send_price,0,',','.')}}</p>
        </td>
    </tr>
    <tr>
        <td>
            <p style="font-size: 12px;margin-bottom: 0px;padding-left: 10px;padding-top: 5px;">Total Bayar : </p>
            <p style="font-size: 12px;margin-bottom: 0px;padding-left: 10px;padding-top: 0px;margin-top: 5px;padding-bottom: 5px;">{{number_format($totalTransaksi+$shops->send_price,0,',','.')}} </p>
        </td>
    </tr>
    <tr>
        <td>
            <p style="font-size: 12px;padding-left: 10px;padding-top: 5px;padding-bottom: 5px;">Proses </p>
        </td>
    </tr>
</table>

<script type="text/javascript">
    var ID_TRANS = '{{$shops->id}}';
    window.onload = function() { window.print(); }
</script>

<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Http\Requests\ProdukEditPost;
use App\Http\Requests\ProdukPost;
use App\Http\Requests\TransaksiPost;
use App\Item;
use App\ItemDetail;
use App\Shop;
use App\ShopDetail;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Intervention\Image\Facades\Image;

class ItemController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        if (!empty($req->brand) || !empty($req->namabarang)) {
            $brand               = $req->brand;
            $nama                = $req->namabarang;
            if(is_null($req->brand) && !is_null($req->namabarang)){
                $data['items']       = \App\Item::where('active', 1)->where('name', 'LIKE',
                "%{$nama}%")
                ->with("brands")
                ->with("itemdetails")
                ->orderBy('created_at', 'desc')
                ->get();
            }
            if(!is_null($req->brand) && is_null($req->namabarang)){
                 $data['items']       = \App\Item::where('active', 1)->where('brands_id', $brand)
                ->with("brands")
                ->with("itemdetails")
                     ->orderBy('created_at', 'desc')
                ->get();
            }
            if(!is_null($req->brand) && !is_null($req->namabarang)){
                $data['items']       = \App\Item::where('active', 1)->where('brands_id', $brand)->where('name', 'LIKE',
                "%{$nama}%")
                ->with("brands")
                ->with("itemdetails")
                    ->orderBy('created_at', 'desc')
                ->get();
            }
            $brands              = \App\Brand::get();
            $data["brands"]      = $brands;
            $data["brandselect"] = $brand;
            $data["namabarang"]  = $nama;
            return view('item/index', $data);
        }
        $data['items']       = \App\Item::where('active', 1)
            ->with("brands")
            ->with("itemdetails")
            ->orderBy('created_at', 'desc')
            ->get();
        $brands              = \App\Brand::get();
        $data["brands"]      = $brands;
        $data["brandselect"] = "";
        $data["namabarang"]  = "";
        return view('item/index', $data);
    }

    public function tambahproduk()
    {
        $brands         = \App\Brand::get();
        $data["brands"] = $brands;
        return view('item/tambahproduk', $data);
    }

    public function simpanproduk(ProdukPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $item            = new Item();
            $item->code      = $req->code;
            $item->name      = $req->name;
            $item->brands_id = $req->brand;
            if ($req->hasFile('gambar')) {
                $image           = $req->file('gambar');
                $name            = "P" . time() . '.' . $image->getClientOriginalExtension();
                $destinationThumbPath = public_path('/images/product_thumb');
                $destinationPath = public_path('/images/product');
                $img = Image::make($image->getRealPath());
                $imgReal = Image::make($image->getRealPath());
                $img->fit(128, 128, function ($constraint) {
                    $constraint->upsize();
                })->save($destinationThumbPath.'/'.$name);
                $imgReal->fit(512, 512, function ($constraint) {
                    $constraint->upsize();
                })->save($destinationPath.'/'.$name);
                $item->picture = $name;
            }
            $item->save();
            $id    = $item->id;
            $size  = $req->size;
            $stok  = $req->stok;
            $harga = $req->harga;
            $berat = $req->berat;
            foreach ($size as $key => $val) {
                $itemdtl           = new ItemDetail();
                $itemdtl->items_id = $id;
                $itemdtl->size     = $size[$key];
                $itemdtl->stock    = $stok[$key];
                $itemdtl->booked   = 0;
                $itemdtl->price    = $harga[$key];
                $itemdtl->weight   = $berat[$key];
                $itemdtl->save();
            }
            $req->session()->flash('success', 'Produk ' . $req->name . ' has been added');
            return redirect('product');
        }
    }

    public function editproduk($id)
    {
        $produk         = \App\Item::where('id', $id)->with("itemdetails")->get();
        $brands         = \App\Brand::get();
        $data["data"]   = $produk;
        $data["brands"] = $brands;
        return view('item/editproduk', $data);
    }

    public function updateproduk(ProdukEditPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $item            = Item::where('id', $req->idproduk)->first();
            $item->code      = $req->code;
            $item->name      = $req->name;
            $item->brands_id = $req->brand;
            if ($req->hasFile('gambar')) {
                $image           = $req->file('gambar');
                $name            = "P" . time() . '.' . $image->getClientOriginalExtension();
                $destinationThumbPath = public_path('/images/product_thumb');
                $destinationPath = public_path('/images/product');
                $img = Image::make($image->getRealPath());
                $imgReal = Image::make($image->getRealPath());
                $img->fit(128, 128, function ($constraint) {
                    $constraint->upsize();
                })->save($destinationThumbPath.'/'.$name);
                $imgReal->fit(512, 512, function ($constraint) {
                    $constraint->upsize();
                })->save($destinationPath.'/'.$name);
                $item->picture = $name;
            }
            $item->save();
            $size  = $req->size;
            $stok  = $req->stok;
            $harga = $req->harga;
            $berat = $req->berat;
            $data  = \App\ItemDetail::where('items_id', $req->idproduk)->get(['id']);
            \App\ItemDetail::destroy($data->toArray());
            foreach ($size as $key => $val) {
                $itemdtl           = new ItemDetail();
                $itemdtl->items_id = $req->idproduk;
                $itemdtl->size     = $size[$key];
                $itemdtl->stock    = $stok[$key];
                $itemdtl->booked   = 0;
                $itemdtl->price    = $harga[$key];
                $itemdtl->weight   = $berat[$key];
                $itemdtl->save();
            }
            $req->session()->flash('success', 'Produk ' . $req->name . ' has been updated');
            return redirect('product');
        }
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function addchartmultiple(Request $request)
    {
        $id               = $request->input('id');
        $jumlah           = $request->input('jumlah');
        $product          = \App\ItemDetail::where("id", $id)->with('items')->get();
        $hargajual        = $product[0]->price;
        $diskon           = Auth::user()->detail->discount;
        $diskon_rupiah    = ($hargajual * $diskon) / 100;
        $hargajual_diskon = $hargajual - $diskon_rupiah;
        $berat            = $product[0]->weight;
        $cart             = Session::get('cart');
        $stock            = $product[0]->stock;
        $endstock         = $stock - $jumlah;
        if ($endstock < 0) {
            return response()->json(['title' => 'Maaf', 'status' => 'error', 'messages' => 'Maaf stok kurang'], 200);
        }
        if (isset($cart[$id])) {
            $cart[$id]['qty'] += $jumlah;
        } else {
            $cart[$product[0]->id] = array(
                "id"               => $id,
                "nama"             => $product[0]->items->name . " " . $product[0]->size,
                "hargajual"        => $hargajual,
                "hargajual_diskon" => $hargajual_diskon,
                "diskon"           => $diskon,
                "diskon_rupiah"    => $diskon_rupiah,
                "qty"              => $jumlah,
                "berat"            => $berat,
            );
        }
        Session::put('cart', $cart);
        return response()->json([
            'title'    => 'Sukses',
            'status'   => 'success',
            'messages' => 'Sukses Masuk Keranjang Belanja'
        ], 200);
    }

    public function addchart(Request $request)
    {
        $id               = $request->input('id');
        $jumlah           = $request->input('jumlah');
        $product          = \App\ItemDetail::where("id", $id)->with('items')->get();
        $hargajual        = $product[0]->price;
        $diskon           = Auth::user()->detail->discount;
        $diskon_rupiah    = ($hargajual * $diskon) / 100;
        $hargajual_diskon = $hargajual - $diskon_rupiah;
        $berat            = $product[0]->weight;
        $cart             = Session::get('cart');
        $stock            = $product[0]->stock;
        $endstock         = $stock - $jumlah;
        if ($endstock < 0) {
            return response()->json(['title' => 'Maaf', 'status' => 'error', 'messages' => 'Maaf stok kurang'], 200);
        }
        $cart[$product[0]->id] = array(
            "id"               => $id,
            "nama"             => $product[0]->items->name . " " . $product[0]->size,
            "hargajual"        => $hargajual,
            "hargajual_diskon" => $hargajual_diskon,
            "diskon"           => $diskon,
            "diskon_rupiah"    => $diskon_rupiah,
            "qty"              => $jumlah,
            "berat"            => $berat,
        );
        Session::put('cart', $cart);
        return response()->json([
            'title'    => 'Sukses',
            'status'   => 'success',
            'messages' => 'Sukses Masuk Keranjang Belanja'
        ], 200);
    }

    public function getcart()
    {
        return Session::get('cart');
    }

    public static function deletecart(Request $request)
    {
        $id   = $request->input('id');
        $cart = Session::get('cart');
        unset($cart[$id]);
        Session::put('cart', $cart);
    }

    public static function destroycart()
    {
        return Session::forget("cart");
    }

    public function detailcart()
    {
        $data['items']     = Session::get('cart');
        $data['customers'] = \App\Customer::orderBy('name', 'desc')->get();
        return view("item/detailcart", $data);
    }

    public function simpantransaksi(TransaksiPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $mytime      = Carbon::now();
            $startTime   = date("Y-m-d H:i:s");
            $limitAt     = date('Y-m-d H:i:s', strtotime('+24 hour', strtotime($startTime)));
            $diskonBunda = Auth::user()->detail->discount;
            $level       = Auth::user()->detail->level->id;
            $parentId    = Auth::user()->detail->parents_id;
            if ($level == 1) {
                $parentId = Auth::user()->id;
            }
            $dataParent    = \App\UserDetail::where("users_id", $parentId)->get();
            $diskonParent  = $dataParent[0]->discount;
            $selisihDiskon = $diskonParent - $diskonBunda;
            $komisiParent  = 0;
            if ($dataParent[0]->levels_id !== 1) {
                $komisiParent = ($req->input('totalTransaksi') * $selisihDiskon) / 100;
            }
            $code               = self::getCode();
            $shop               = new Shop();
            $shop->code         = $code;
            $shop->users_id     = Auth::user()->id;
            $shop->customers_id = $req->input('namaPelangganDrop');
            $shop->sender_name  = $req->input('namaPengirim');

            $shop->receiver_name          = "";
            $shop->receiver_phone         = $req->input('telpPelanggan');
            $shop->receiver_address       = $req->input('alamatPelanggan');
            $shop->receiver_province      = $req->input('propinsiPelanggan');
            $shop->receiver_province_name = $req->input('propinsiNamePelanggan');
            $shop->receiver_city          = $req->input('kabupatenPelanggan');
            $shop->receiver_city_name     = $req->input('kabupatenNamePelanggan');
            $shop->receiver_district      = 0;
            $shop->receiver_district_name = null;
            $shop->price                  = $req->input('totalTransaksi');
            $shop->price_discount         = $req->input('totalDiskon');
            $shop->price_final            = $req->input('totalBayar');
            $shop->send_courier           = $req->input('courier');
            $shop->send_service           = $req->input('ongkosKirimService');
            $shop->send_price             = $req->input('ongkosKirim');
            $shop->note                   = $req->input('number');
            $shop->users_komisi           = $parentId;
            $shop->komisi                 = $komisiParent;
            $shop->limited_at             = $limitAt;
            $shop->confirm_at             = $mytime->toDateTimeString();
            $shop->save();
            self::saveDetail($shop->id);
            self::destroycart();
            $req->session()->flash('success', 'Transaksi ' . $shop->code . ' has been added');
            return redirect('shop/konfirmasi/' . $shop->id);
        }
    }

    public static function getCode()
    {
        $max = \App\Shop::all()->max('code');
        if ($max == null) {
            $noUrut = 1;
        } else {
            $noUrut = (int)substr($max, 3, 3);
            $noUrut++;
        }
        $char       = "TRX";
        $kodeBarang = $char . sprintf("%03s", $noUrut);
        return $kodeBarang;
    }

    public static function saveDetail($idShop)
    {
        $items = Session::get('cart');
        foreach ($items as $item) {
            $shopDetail                       = new ShopDetail();
            $shopDetail->shops_id             = $idShop;
            $shopDetail->items_id             = $item["id"];
            $shopDetail->items_name           = $item["nama"];
            $shopDetail->items_price          = $item["hargajual"];
            $shopDetail->items_price_discount = $item["hargajual_diskon"];
            $shopDetail->discount             = $item["diskon"];
            $shopDetail->discount_rupiah      = $item["diskon_rupiah"];
            $shopDetail->qty                  = $item["qty"];
            $shopDetail->weight               = $item["berat"];
            self::updateStok($shopDetail->items_id, $shopDetail->qty);
            $shopDetail->save();
        }
    }

    public static function updateStok($itemId, $itemQty)
    {
        $itemDetail        = ItemDetail::find($itemId);
        $oldStok           = $itemDetail->stock;
        $newStok           = $oldStok - $itemQty;
        $itemDetail->stock = $newStok;
        $itemDetail->save();
    }

    public function tampilprovinsi()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL            => "https://api.rajaongkir.com/starter/province",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => "",
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => "GET",
            CURLOPT_HTTPHEADER     => array(
                "key: 8b27d5bfe621fc6a45caaa58e387d5ec"
            ),
        ));

        $response = curl_exec($curl);
        $err      = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "<option>Error</option>";
        } else {
        }
        echo "<option></option>";
        $data = json_decode($response, true);
        for ($i = 0; $i < count($data['rajaongkir']['results']); $i++) {
            echo "<option value='" . $data['rajaongkir']['results'][$i]['province_id'] . "'>" . $data['rajaongkir']['results'][$i]['province'] . "</option>";
        }
    }

    public function tampilkota(Request $req)
    {
        $idprovinsi = $req->input('idprovinsi');
        $curl       = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL            => "https://api.rajaongkir.com/starter/city?province=" . $idprovinsi,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => "",
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => "GET",
            CURLOPT_HTTPHEADER     => array(
                "key: 8b27d5bfe621fc6a45caaa58e387d5ec"
            ),
        ));

        $response = curl_exec($curl);
        $err      = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "<option>Error</option>";
        } else {
        }
        echo "<option>Pilih Kota Asal</option>";
        $data = json_decode($response, true);
        for ($i = 0; $i < count($data['rajaongkir']['results']); $i++) {
            echo "<option value='" . $data['rajaongkir']['results'][$i]['city_id'] . "'>" . $data['rajaongkir']['results'][$i]['type'] . " " . $data['rajaongkir']['results'][$i]['city_name'] . "</option>";
        }
    }

    public function tampilharga(Request $request)
    {
        $idorigin      = $request->input("idorigin");
        $iddestination = $request->input("iddestination");
        $berat         = $request->input("berat");
        $kurir         = $request->input("kurir");
        $curl          = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL            => "https://api.rajaongkir.com/starter/cost",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => "",
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => "POST",
            CURLOPT_POSTFIELDS     => "origin=" . $idorigin . "&destination=" . $iddestination . "&weight=" . $berat . "&courier=" . $kurir,
            CURLOPT_HTTPHEADER     => array(
                "content-type: application/x-www-form-urlencoded",
                "key: 8b27d5bfe621fc6a45caaa58e387d5ec"
            ),
        ));

        $response = curl_exec($curl);
        $err      = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            return $response;
        }
    }

    public function savecustomer(Request $req)
    {
        $customer                = new Customer();
        $customer->name          = $req->input('nama_pelanggan_new');
        $customer->phone         = $req->input('no_handphone_new');
        $customer->address       = $req->input('alamat_new');
        $customer->province      = $req->input('idpropinsi');
        $customer->province_name = $req->input('propinsiNameModal');
        $customer->city          = $req->input('idkabupaten');
        $customer->city_name     = $req->input('kabupatenNameModal');
        $customer->userId        = Auth::user()->id;
        $customer->save();
        return response()->json(['status' => true, 'id' => $customer->id, 'data' => $customer], 200);
    }

    public function tampilcustomer()
    {
        $userId   = Auth::user()->id;
        $response = \App\Customer::where("userId", $userId)->orderBy('name', 'desc')->get();
        echo "<option></option>";
        foreach ($response as $customer) {
            echo "<option value='" . $customer->id . "'>" . $customer->name . "</option>";
        }
    }

    public function tampilcustomerid(Request $req)
    {
        $id       = $req->input('id');
        $response = \App\Customer::find($id);
        return response()->json(['status' => true, 'id' => $id, 'data' => $response], 200);
    }

    public function history()
    {
        return view('shop/history');
    }

    public function showhistory(Request $request)
    {
        $keyword   = $request->input('keyword');
        $startdate = $request->input('startdate');
        $enddate   = $request->input('enddate');

        $columns = array(
            0  => 'code',
            1  => 'rekanan',
            2  => 'pengirim',
            3  => 'pelanggan',
            4  => 'hp',
            5  => 'alamat',
            6  => 'total',
            7  => 'diskon',
            8  => 'jml',
            9  => 'ongkir',
            10 => 'gtotal',
            11 => 'status',
            12 => 'aksi',
        );

        $userId    = Auth::user()->id;
        $levels_id = Auth::user()->detail->level->id;
        if ($levels_id == "1") {
            $totalData = \App\Shop::whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])->
            count();
        } else {
            $totalData = \App\Shop::where('users_id', $userId)->whereBetween('created_at',
                [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                ->count();
        }
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');

        if (empty($keyword)) {
            if ($levels_id == "1") {
                $shops = \App\Shop::offset($start)
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
            } else {
                $shops = \App\Shop::where('users_id', $userId)
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->offset($start)
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
            }
        } else {
            $search = $keyword;
            if ($levels_id == "1") {
                $shops         = \App\Shop::where('code', 'LIKE', "%{$search}%")
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
                $totalFiltered = \App\Shop::where('code', 'LIKE', "%{$search}%")
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->count();
            } else {
                $shops         = \App\Shop::where('code', 'LIKE', "%{$search}%")
                    ->where('users_komisi', "=", $userId)
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
                $totalFiltered = \App\Shop::where('code', 'LIKE', "%{$search}%")
                    ->where('users_komisi', "=", $userId)
                    ->whereBetween('created_at', [$startdate . " 00:00:00", $enddate . " 23:59:59"])
                    ->with("users")
                    ->with("customers")
                    ->with("shopdetails")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->count();
            }
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                if ($shop->status == 0) {
                    $status = "<span class='col-pink'>Belum bayar</span>";
                    $aksi   = "<a href='/shop/konfirmasi/$shop->id' class='btn bg-orange btn-xs waves-effect'>Konfirmasi bayar</a>";
                } elseif ($shop->status == 1) {
                    $status = "<span class='label label-primary'>Sudah bayar</span>";
                    $level  = Auth::user()->detail->level->id;
                    if ($level == 1) {
                        $aksi = "<a href='/shop/print/$shop->id' class='btn bg-brown btn-xs waves-effect'>Print label</a>";
                    } else {
                        $aksi = "-";
                    }
                } elseif ($shop->status == 2) {
                    $status = "<span class='label label-primary'>Sudah Print</span>";
                    if ($levels_id == 1) {
                        $aksi = "<a href='/shop/konfirmkirim/$shop->id' class='btn bg-purple btn-xs waves-effect'>Konfirm Kirim</a>";
                        $aksi = $aksi . " <a href='/shop/print/$shop->id' class='btn bg-brown btn-xs waves-effect'>Print label</a>";

                    } else {
                        $aksi = "-";
                    }
                } elseif ($shop->status == 3) {
                    $status = "<span class='label label-primary'>Sudah Kirim</span>";
                    if ($levels_id == 1) {
                        $aksi = "<a href='/shop/inputresi/$shop->id' class='btn bg-green btn-xs waves-effect'>Input Resi</a>";
                    } else {
                        $aksi = "-";
                    }
                } else {
                    $status = "<span class='label label-primary'>Selesai</span>";
                    $aksi   = "";
                }
                $link   = '<a class="btn btn-xs btn-primary invoice" data-id="' . $shop->id . '">' . $shop->code . '</a>';
                $data[] = [
                    $link,
                    $shop->users->name,
                    $shop->sender_name,
                    $shop->customers->name,
                    $shop->receiver_phone,
                    $shop->receiver_address,
                    number_format(($shop->price_final), 0, ',', '.'),
                    $shop->price_discount,
                    $shop->shopdetails->sum('qty'),
                    number_format(($shop->send_price), 0, ',', '.'),
                    number_format(($shop->price_final + $shop->send_price), 0, ',', '.'),
                    $status,
                    $aksi
                ];
            }
        }

        $json_data = array(
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );
        echo json_encode($json_data);
    }

    public function confirmshop($id)
    {
        $userId              = Auth::user()->id;
        $data['shops']       = \App\Shop::where('id', $id)
            ->orderBy('code', 'desc')
            ->first();
        $data['shopsdetail'] = \App\Shop::where('id', $id)->with("shopdetails")->first();
        return view('shop/confirmshop', $data);
    }

    public function konfirmasitransfer(Request $request)
    {
        $mytime   = Carbon::now();
        $level    = Auth::user()->detail->level->id;
        $id       = $request->input('id');
        $data     = \App\Shop::where('id', $id)
            ->with("users")
            ->orderBy('code', 'desc')
            ->first();
        $totalAll = $data->price_final + $data->send_price;
        $dataUser = $data->users;
        if ($level == 1) {
            $data->status     = 1;
            $data->payment_at = $mytime->toDateTimeString();
            $data->save();
            return true;
        }
        if ($dataUser->detail->deposit > $totalAll) {
            $dataUser          = \App\UserDetail::where('users_id', $data->users_id)->first();
            $newDeposit        = $dataUser->deposit - $totalAll;
            $dataUser->deposit = $newDeposit;
            $dataUser->save();
            $data->status     = 1;
            $data->payment_at = $mytime->toDateTimeString();
            $data->save();
            return true;
        }
        return "deposit tidak cukup";
    }

    public function deposit()
    {
        return view('deposit/deposit');
    }

    public function printlabel($id)
    {
        $mytime          = Carbon::now();
        $trans           = \App\Shop::where('id', $id)
            ->with("users")
            ->orderBy('code', 'desc')
            ->first();
        $trans->status   = 2;
        $trans->print_at = $mytime->toDateTimeString();
        $trans->save();

        $data['shops']       = \App\Shop::where('id', $id)
            ->orderBy('code', 'desc')
            ->first();
        $data['shopsdetail'] = \App\Shop::where('id', $id)->with("shopdetails")->first();
        return view('shop/printshop', $data);
    }

    public function konfirmkirim($id)
    {
        $mytime         = Carbon::now();
        $trans          = \App\Shop::where('id', $id)
            ->with("users")
            ->orderBy('code', 'desc')
            ->first();
        $trans->status  = 3;
        $trans->send_at = $mytime->toDateTimeString();
        $trans->save();
        return redirect('shop/history');
    }

    public function inputresi($id)
    {
        $data['shops']       = \App\Shop::where('id', $id)
            ->orderBy('code', 'desc')
            ->first();
        $data['shopsdetail'] = \App\Shop::where('id', $id)->with("shopdetails")->first();
        return view('shop/inputresi', $data);
    }

    public function simpanresi(Request $req)
    {
        $mytime           = Carbon::now();
        $shop             = \App\Shop::where('id', $req->idtransaksi)->first();
        $shop->no_resi    = $req->noresi;
        $shop->status     = 4;
        $shop->airbill_at = $mytime->toDateTimeString();
        $shop->save();
        $req->session()->flash('success', 'Input resi untuk kode transaksi ' . $shop->code . ' has been update');
        return redirect('shop/history');
    }

    public function detailshop($id)
    {
        $userId              = Auth::user()->id;
        $data['shops']       = \App\Shop::where('id', $id)
            ->orderBy('code', 'desc')
            ->first();
        $data['shopsdetail'] = \App\Shop::where('id', $id)->with("shopdetails")->first();
        return view('shop/detailshop', $data);
    }

    public function laporanmarketer()
    {
        return view('item/laporanmarketer');
    }

    public function showlaporanmarketer(Request $request)
    {
        $keyword = $request->input('keyword');
        $bulan   = $request->input('bulan');
        $tahun   = $request->input('tahun');

        $columns       = array(
            0 => 'name',
            1 => 'induk',
            2 => 'sisadeposit',
            4 => 'transaksi',
            5 => 'target',
            6 => 'sisa'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
            $q->where('parents_id', $userId)->where('levels_id', 3);
        })->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($keyword)) {
            $shops = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })->with("shops")->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $keyword;
            $shops         = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })->with("shops")->where('name', 'LIKE', "%{$search}%")->whereMonth('created_at',
                $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })->with("shops")->where('name', 'LIKE', "%{$search}%")->whereMonth('created_at',
                $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {

                $data[] = [
                    $shop->name,
                    $shop->detail->parent->name,
                    number_format(($shop->detail->deposit), 0, ',', '.'),
                    number_format(($shop->shops->sum('price_final')), 0, ',', '.'),
                    number_format(($shop->detail->target), 0, ',', '.'),
                    number_format(($shop->detail->target - $shop->shops->sum('price_final')), 0, ',', '.'),
                ];
            }
        }
        $json_data = array(
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );
        echo json_encode($json_data);
    }

    public function laporanreseller()
    {
        return view('item/laporanreseller');
    }

    public function showlaporanreseller(Request $request)
    {
        $keyword = $request->input('keyword');
        $bulan   = $request->input('bulan');
        $tahun   = $request->input('tahun');

        $columns       = array(
            0 => 'name',
            1 => 'induk',
            2 => 'sisadeposit',
            4 => 'transaksi',
            5 => 'target',
            6 => 'sisa'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
            $q->where('parents_id', $userId)->where('levels_id', 2);
        })->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($keyword)) {
            $shops = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)->with("shops")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $keyword;
            $shops         = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })->with("shops")->where('name', 'LIKE', "%{$search}%")->whereMonth('created_at',
                $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })->with("shops")->where('name', 'LIKE', "%{$search}%")->whereMonth('created_at',
                $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {

                $data[] = [
                    $shop->name,
                    $shop->detail->parent->name,
                    number_format(($shop->detail->deposit), 0, ',', '.'),
                    number_format(($shop->shops->sum('price_final')), 0, ',', '.'),
                    number_format(($shop->detail->target), 0, ',', '.'),
                    number_format(($shop->detail->target - $shop->shops->sum('price_final')), 0, ',', '.'),
                ];
            }
        }
        $json_data = array(
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );
        echo json_encode($json_data);
    }

    public function laporanpenjualan()
    {
        return view('item/laporanpenjualan');
    }

    public function showlaporanpenjualan(Request $request)
    {
        $keyword = $request->input('keyword');
        $bulan   = $request->input('bulan');
        $tahun   = $request->input('tahun');

        $columns       = array(
            0 => 'code',
            1 => 'users.name',
            2 => 'sisadeposit',
            3 => 'transaksi',
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\Shop::with("users")->with("customers")->whereMonth('created_at',
            $bulan)->whereYear('created_at', $tahun)->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($keyword)) {
            $shops = \App\Shop::with("users")->with("customers")->whereMonth('created_at',
                $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $keyword;
            $shops         = \App\Shop::with("users")->with("customers")->where('code', 'LIKE',
                "%{$search}%")->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\Shop::with("users")->with("customers")->where('code', 'LIKE',
                "%{$search}%")->whereMonth('created_at', $bulan)->whereYear('created_at', $tahun)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {

                $data[] = [
                    $shop->code,
                    $shop->users->name,
                    $shop->customers->name,
                    number_format($shop->price_final, 0, ',', '.'),
                ];
            }
        }
        $json_data = array(
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );
        echo json_encode($json_data);
    }

}
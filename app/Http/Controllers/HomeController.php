<?php

namespace App\Http\Controllers;

use App\Brand;
use App\Customer;
use App\Deposit;
use App\Http\Requests\DepositiPost;
use App\Http\Requests\PelangganPost;
use App\Http\Requests\ResellerPost;
use App\Shop;
use App\User;
use App\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class HomeController extends Controller
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
    public function index()
    {
        $userId                 = Auth::user()->id;
        $levels_id              = Auth::user()->detail->level->id;
        $totalPenjualanMarketer = 0;
        $totalPenjualanReseller = 0;
        if ($levels_id == "1") {
            $shops         = \App\Shop::with('shopdetails')->get();
            $shopsMarketer = \App\Shop::with('users')->whereHas('users.detail', function ($q) {
                $q->where('levels_id', 2);
            })->get();
            $shopsReseller = \App\Shop::with('users')->whereHas('users.detail', function ($q) {
                $q->where('levels_id', 3);
            })->get();
            foreach ($shopsMarketer as $shopMarketer) {
                $totalPenjualanMarketer += $shopMarketer->price_final;
            }
            foreach ($shopsReseller as $shopReseller) {
                $totalPenjualanReseller += $shopReseller->price_final;
            }
        } else {
            $shops = \App\Shop::where('users_id', $userId)->get();
        }
        $totalPenjualan = 0;
        foreach ($shops as $shop) {
            $totalPenjualan += $shop->price_final;
        }
        $topsMarketer                   = User::with('detail')->whereHas('detail', function ($q) {
            $q->where('levels_id', 2);
        })->withCount('shops')->latest('shops_count')->take(5)->with('shops')->get();
        $topsReseller                   = User::with('detail')->whereHas('detail', function ($q) {
            $q->where('levels_id', 3);
        })->withCount('shops')->latest('shops_count')->take(5)->with('shops')->get();
        $data["totalPenjualan"]         = $totalPenjualan;
        $data["totalPenjualanMarketer"] = $totalPenjualanMarketer;
        $data["totalPenjualanReseller"] = $totalPenjualanReseller;
        $data["topsMarketer"]           = $topsMarketer;
        $data["topsReseller"]           = $topsReseller;
        $dataPenjualan                  = Shop::select('id', 'created_at')
            ->where('users_id', $userId)
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->created_at)->format('m'); // grouping by months
            });

        $usermcount = [];
        $userMont = [];
        $userArr    = [];
        $bulanPenjualan    = [];
        $bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Nopember', 'Desember'];
        foreach ($dataPenjualan as $key => $value) {
            $usermcount[(int)$key - 1] = count($value);
        }
        for ($i = 0; $i < 12; $i++) {
            if (!empty($usermcount[$i])) {
                $userArr[] = $usermcount[$i];
                $userMont[] = $i;
            } 
        }
        foreach ($userMont as $key => $value){
            $bulanPenjualan[] = $bulan[$value+1];
        }
        $data["linePenjualan"] = $userArr;
        $data["bulanPenjualan"] = $bulanPenjualan;
        return view('home/index', $data);
    }

    /**
     * Show the application profile.
     *
     * @return \Illuminate\Http\Response
     */
    public function profile()
    {
        return view('home/profile');
    }

    public function deposit()
    {
        return view('home/deposit');
    }

    public function isideposit()
    {
        $data['pelanggan'] = \App\User::with("detail")->orderBy('name', 'desc')->get();
        return view('home/isideposit', $data);
    }

    public function showdeposit(Request $request)
    {
        $columns       = array(
            0 => 'nominal',
            1 => 'note',
            2 => 'transfer_at',
            3 => 'approve_at',
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\Deposit::where('users_id', $userId)->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\Deposit::where('users_id', $userId)
                ->offset($start)
                ->with("users")
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\Deposit::where('nominal', 'LIKE', "%{$search}%")
                ->with("users")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\Shop::where('nominal', 'LIKE', "%{$search}%")
                ->with("users")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $data[] = [
                    number_format(($shop->nominal), 0, ',', '.'),
                    $shop->note,
                    $shop->transfer_at,
                    $shop->approve_at
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

    public function simpandeposit(DepositiPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $dep              = new Deposit();
            $dep->users_id    = $req->userId;
            $dep->nominal     = $req->nominal;
            $dep->transfer_at = $req->tgltransfer . " " . date("h:i:s");
            $dep->approve_at  = $req->tglapprove . " " . date("h:i:s");;
            $dep->note = $req->note;
            $dep->save();
            $userDet          = UserDetail::where('users_id', $req->userId)->first();
            $oldDep           = $userDet->deposit;
            $newDep           = $oldDep + $req->nominal;
            $userDet->deposit = $newDep;
            $userDet->save();
            $req->session()->flash('success', 'Deposit has been added');
            return redirect('isideposit');
        }
    }

    public function komisi()
    {
        return view('home/komisi');
    }

    public function showkomisi(Request $request)
    {
        $columns       = array(
            0 => 'code',
            1 => 'rekanan',
            2 => 'total'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\Shop::where('users_id', $userId)->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\Shop::where('users_komisi', $userId)
                ->offset($start)
                ->with("users")
                ->with("customers")
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\Shop::where('code', 'LIKE', "%{$search}%")
                ->where('users_komisi', "=", $userId)
                ->with("users")
                ->with("customers")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\Shop::where('code', 'LIKE', "%{$search}%")
                ->where('users_komisi', "=", $userId)
                ->with("users")
                ->with("customers")
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
                    $shop->sender_name,
                    number_format(($shop->komisi), 0, ',', '.')
                ];
            }
        }
        $json_data = array(
            "totalKomisi"     => intval($request->input('draw')),
            "draw"            => intval($request->input('draw')),
            "recordsTotal"    => intval($totalData),
            "recordsFiltered" => intval($totalFiltered),
            "data"            => $data
        );
        echo json_encode($json_data);
    }

    public function reseller()
    {
        return view('home/reseller');
    }

    public function showreseller(Request $request)
    {
        $columns       = array(
            0 => 'name',
            1 => 'email',
            2 => 'address',
            4 => 'phone',
            5 => 'aksi',
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
            $q->where('parents_id', $userId)->where('levels_id', 2);
        })->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 2);
            })->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $aksi   = '<a href="reseller/edit/' . $shop->id . '" class="btn bg-orange btn-xs waves-effect">Edit</a> <a href="reseller/delete/' . $shop->id . '" class="btn bg-red btn-xs waves-effect">Delete</a>';
                $link   = '<a class="btn btn-xs btn-primary detail" data-id="' . $shop->id . '">' . $shop->name . '</a>';
                $data[] = [
                    $link,
                    $shop->email,
                    $shop->detail->address,
                    $shop->detail->phone,
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

    public function tambahreseller()
    {
        return view('home/tambahreseller');
    }

    public function editreseller($id)
    {
        $data = $shops = \App\User::where('id', $id)->with("detail")->whereHas('detail', function ($q) {
            $q->where('levels_id', 2);
        })->get();
        return view('home/editreseller', compact('data'));
    }

    public function simpanreseller(ResellerPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $userId             = Auth::user()->id;
            $reseller           = new User();
            $reseller->name     = $req->nama;
            $reseller->email    = $req->email;
            $reseller->password = Hash::make($req->password);
            $reseller->save();
            $id                          = $reseller->id;
            $resellerdtl                 = new UserDetail();
            $resellerdtl->users_id       = $id;
            $resellerdtl->levels_id      = 2;
            $resellerdtl->parents_id     = $userId;
            $resellerdtl->address        = $req->alamat;
            $resellerdtl->provinces_id   = $req->propinsiPelanggan;
            $resellerdtl->provinces_name = $req->propinsiName;
            $resellerdtl->citys_id       = $req->kabupatenPelanggan;
            $resellerdtl->citys_name     = $req->kabupatenName;
            $resellerdtl->districts_id   = 0;
            $resellerdtl->districts_name = "";
            $resellerdtl->phone          = $req->telp;
            $resellerdtl->bbm            = $req->line;
            $resellerdtl->wa             = $req->wa;
            $resellerdtl->wa_template    = $req->watemplate;
            $resellerdtl->line           = $req->line;
            $resellerdtl->discount       = $req->diskon;;
            $resellerdtl->is_deposit = 0;
            $resellerdtl->deposit    = 0;
            $resellerdtl->balance    = 0;
            $resellerdtl->save();
            $req->session()->flash('success', 'Reseller ' . $req->nama . ' has been added');
            return redirect('shop/reseller');
        }
    }

    public function updatereseller(Request $req)
    {
        $userId          = Auth::user()->id;
        $reseller        = User::where('id', $req->idreseller)->first();
        $reseller->name  = $req->nama;
        $reseller->email = $req->email;
        if (!empty($req->password)) {
            $reseller->password = Hash::make($req->password);
        }
        $reseller->save();
        $id                          = $reseller->id;
        $resellerdtl                 = UserDetail::where('users_id', $req->idreseller)->first();
        $resellerdtl->users_id       = $id;
        $resellerdtl->levels_id      = 2;
        $resellerdtl->parents_id     = $userId;
        $resellerdtl->address        = $req->alamat;
        $resellerdtl->provinces_id   = $req->propinsiPelanggan;
        $resellerdtl->provinces_name = $req->propinsiName;
        $resellerdtl->citys_id       = $req->kabupatenPelanggan;
        $resellerdtl->citys_name     = $req->kabupatenName;
        $resellerdtl->districts_id   = 0;
        $resellerdtl->districts_name = "";
        $resellerdtl->phone          = $req->telp;
        $resellerdtl->bbm            = $req->line;
        $resellerdtl->wa             = $req->wa;
        $resellerdtl->wa_template    = $req->watemplate;
        $resellerdtl->line           = $req->line;
        $resellerdtl->discount       = $req->diskon;;
        $resellerdtl->is_deposit = 0;
        $resellerdtl->balance    = 0;
        $resellerdtl->save();
        $req->session()->flash('success', 'Reseller ' . $req->nama . ' has been update');
        return redirect('shop/reseller');
    }

    public function marketer()
    {
        return view('home/marketer');
    }

    public function showmarketer(Request $request)
    {
        $columns       = array(
            0 => 'name',
            1 => 'email',
            2 => 'address',
            4 => 'phone',
            5 => 'aksi'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
            $q->where('parents_id', $userId)->where('levels_id', 3);
        })->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId)->where('levels_id', 3);
            })->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $aksi = '<a href="marketer/edit/' . $shop->id . '" class="btn bg-orange btn-xs waves-effect">Edit</a> <a href="marketer/delete/' . $shop->id . '" class="btn bg-red btn-xs waves-effect">Delete</a>';
                $link = '<a class="btn btn-xs btn-primary detail" data-id="' . $shop->id . '">' . $shop->name . '</a>';

                $data[] = [
                    $link,
                    $shop->email,
                    $shop->detail->address,
                    $shop->detail->phone,
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

    public function tambahmarketer()
    {
        return view('home/tambahmarketer');
    }

    public function simpanmarketer(ResellerPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $userId             = Auth::user()->id;
            $reseller           = new User();
            $reseller->name     = $req->nama;
            $reseller->email    = $req->email;
            $reseller->password = Hash::make($req->password);
            $reseller->save();
            $id                          = $reseller->id;
            $resellerdtl                 = new UserDetail();
            $resellerdtl->users_id       = $id;
            $resellerdtl->levels_id      = 3;
            $resellerdtl->parents_id     = $userId;
            $resellerdtl->address        = $req->alamat;
            $resellerdtl->provinces_id   = $req->propinsiPelanggan;
            $resellerdtl->provinces_name = $req->propinsiName;
            $resellerdtl->citys_id       = $req->kabupatenPelanggan;
            $resellerdtl->citys_name     = $req->kabupatenName;
            $resellerdtl->districts_id   = 0;
            $resellerdtl->districts_name = "";
            $resellerdtl->phone          = $req->telp;
            $resellerdtl->bbm            = $req->line;
            $resellerdtl->wa             = $req->wa;
            $resellerdtl->wa_template    = $req->watemplate;
            $resellerdtl->line           = $req->line;
            $resellerdtl->discount       = $req->diskon;;
            $resellerdtl->is_deposit = 0;
            $resellerdtl->deposit    = 0;
            $resellerdtl->balance    = 0;
            $resellerdtl->save();
            $req->session()->flash('success', 'Marketer ' . $req->nama . ' has been added');
            return redirect('shop/marketer');
        }
    }

    public function editmarketer($id)
    {
        $data = $shops = \App\User::where('id', $id)->with("detail")->whereHas('detail', function ($q) {
            $q->where('levels_id', 3);
        })->get();
        return view('home/editmarketer', compact('data'));
    }

    public function updatemarketer(Request $req)
    {
        $userId          = Auth::user()->id;
        $reseller        = User::where('id', $req->idmarketer)->first();
        $reseller->name  = $req->nama;
        $reseller->email = $req->email;
        if (!empty($req->password)) {
            $reseller->password = Hash::make($req->password);
        }
        $reseller->save();
        $id                          = $reseller->id;
        $resellerdtl                 = UserDetail::where('users_id', $req->idmarketer)->first();
        $resellerdtl->users_id       = $id;
        $resellerdtl->levels_id      = 3;
        $resellerdtl->parents_id     = $userId;
        $resellerdtl->address        = $req->alamat;
        $resellerdtl->provinces_id   = $req->propinsiPelanggan;
        $resellerdtl->provinces_name = $req->propinsiName;
        $resellerdtl->citys_id       = $req->kabupatenPelanggan;
        $resellerdtl->citys_name     = $req->kabupatenName;
        $resellerdtl->districts_id   = 0;
        $resellerdtl->districts_name = "";
        $resellerdtl->phone          = $req->telp;
        $resellerdtl->bbm            = $req->line;
        $resellerdtl->wa             = $req->wa;
        $resellerdtl->wa_template    = $req->watemplate;
        $resellerdtl->line           = $req->line;
        $resellerdtl->discount       = $req->diskon;;
        $resellerdtl->is_deposit = 0;
        $resellerdtl->balance    = 0;
        $resellerdtl->save();
        $req->session()->flash('success', 'Marketer ' . $req->nama . ' has been update');
        return redirect('shop/marketer');
    }

    public function pelanggan()
    {
        return view('home/pelanggan');
    }

    public function showpelanggan(Request $request)
    {
        $columns   = array(
            0 => 'name',
            1 => 'address',
            2 => 'phone',
            3 => 'province_name',
            4 => 'city_name',
            5 => 'rekanan',
            6 => 'aksi',
        );
        $userId    = Auth::user()->id;
        $levels_id = Auth::user()->detail->level->id;
        if ($levels_id == "1") {
            $totalData = \App\Customer::count();
        } else {
            $totalData = \App\Customer::where('userId', $userId)->count();
        }
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            if ($levels_id == "1") {
                $shops = \App\Customer::offset($start)
                    ->with("users")
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
            } else {
                $shops = \App\Customer::where('userId', $userId)
                    ->with("users")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
            }
        } else {
            $search = $request->input('search.value');
            if ($levels_id == "1") {
                $shops         = \App\Customer::where('name', 'LIKE', "%{$search}%")
                    ->with("users")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
                $totalFiltered = \App\Customer::where('name', 'LIKE', "%{$search}%")
                    ->with("users")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->count();
            } else {
                $shops         = \App\Customer::where('userId', $userId)->where('name', 'LIKE', "%{$search}%")
                    ->with("users")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->get();
                $totalFiltered = \App\Customer::where('userId', $userId)->where('name', 'LIKE', "%{$search}%")
                    ->with("users")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy($order, $dir)
                    ->count();
            }
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $aksi   = '<a href="pelanggan/edit/' . $shop->id . '" class="btn bg-orange btn-xs waves-effect">Edit</a> <a href="pelanggan/delete/' . $shop->id . '" class="btn bg-red btn-xs waves-effect">Delete</a>';
                $data[] = [
                    $shop->name,
                    $shop->address,
                    $shop->phone,
                    $shop->province_name,
                    $shop->city_name,
                    $shop->users->name,
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

    public function tambahpelanggan()
    {
        return view('home/tambahpelanggan');
    }

    public function simpanpelanggan(PelangganPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $userId                  = Auth::user()->id;
            $customer                = new Customer();
            $customer->name          = $req->nama;
            $customer->address       = $req->alamat;
            $customer->phone         = $req->telp;
            $customer->province      = $req->propinsiPelanggan;
            $customer->province_name = $req->propinsiName;
            $customer->city          = $req->kabupatenPelanggan;
            $customer->city_name     = $req->kabupatenName;
            $customer->district      = 0;
            $customer->district_name = "";
            $customer->userId        = $userId;
            $customer->save();
            $req->session()->flash('success', 'Pelanggan ' . $req->nama . ' has been added');
            return redirect('shop/pelanggan');
        }
    }

    public function editpelanggan($id)
    {
        $data = \App\Customer::where('id', $id)->with("users")->get();
        return view('home/editpelanggan', compact('data'));
    }

    public function deletepelanggan($id)
    {
        $data = \App\Customer::where('id', $id)->with("users")->first();
        $data->delete();
        return redirect('shop/pelanggan');

    }

    public function updatepelanggan(Request $req)
    {
        $userId                  = Auth::user()->id;
        $customer                = \App\Customer::where('id', $req->idpelanggan)->first();
        $customer->name          = $req->nama;
        $customer->address       = $req->alamat;
        $customer->phone         = $req->telp;
        $customer->province      = $req->propinsiPelanggan;
        $customer->province_name = $req->propinsiName;
        $customer->city          = $req->kabupatenPelanggan;
        $customer->city_name     = $req->kabupatenName;
        $customer->district      = 0;
        $customer->district_name = "";
        $customer->userId        = $userId;
        $customer->save();
        $req->session()->flash('success', 'Pelanggan ' . $req->nama . ' has been updated');
        return redirect('shop/pelanggan');
    }

    public function brand()
    {
        return view('home/brand');
    }

    public function showbrand(Request $request)
    {
        $columns       = array(
            0 => 'name',
            1 => 'aksi'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\Brand::count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\Brand::offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\Brand::where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\Brand::where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $aksi   = '<a href="brand/edit/' . $shop->id . '" class="btn bg-orange btn-xs waves-effect">Edit</a> <a href="brand/delete/' . $shop->id . '" class="btn bg-red btn-xs waves-effect">Delete</a>';
                $data[] = [
                    $shop->name,
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

    public function tambahbrand()
    {
        return view('home/tambahbrand');
    }

    public function simpanbrand(Request $req)
    {
        $validatedData = $req->validate([
            'nama' => 'required|max:255'
        ]);
        if ($validatedData) {
            $brand       = new Brand();
            $brand->name = $req->nama;
            $brand->save();
            $req->session()->flash('success', 'Brand ' . $req->nama . ' has been added');
            return redirect('brand');
        }
    }

    public function editbrand($id)
    {
        $data = \App\Brand::where('id', $id)->get();
        return view('home/editbrand', compact('data'));
    }

    public function deletebrand($id)
    {
        $data = \App\Brand::where('id', $id)->first();
        $data->delete();
        return redirect('brand');
    }

    public function updatebrand(Request $req)
    {
        $brand       = \App\Brand::where('id', $req->idbrand)->first();
        $brand->name = $req->nama;
        $brand->save();
        $req->session()->flash('success', 'Brand ' . $req->nama . ' has been updated');
        return redirect('brand');
    }

    public function deletereseller($id)
    {
        $data = \App\User::where('id', $id)->first();
        $data->delete();
        return redirect('shop/reseller');
    }

    public function deletemarketer($id)
    {
        $data = \App\User::where('id', $id)->first();
        $data->delete();
        return redirect('shop/marketer');
    }

    public function detailreseller($id)
    {
        $data['user'] = \App\User::where('id', $id)->with("detail")
            ->first();
        return view('home/detailuser', $data);
    }

    public function detailmarketer($id)
    {
        $data['user'] = \App\User::where('id', $id)->with("detail")
            ->first();
        return view('home/detailuser', $data);
    }

    public function rekanan()
    {
        return view('home/rekanan');
    }

    public function showrekanan(Request $request)
    {
        $columns       = array(
            0 => 'name',
            1 => 'email',
            2 => 'address',
            4 => 'phone',
            5 => 'level',
            6 => 'aksi'
        );
        $userId        = Auth::user()->id;
        $totalData     = \App\User::with("detail")->with("level")->count();
        $totalFiltered = $totalData;
        $limit         = $request->input('length');
        $start         = $request->input('start');
        $order         = $columns[$request->input('order.0.column')];
        $dir           = $request->input('order.0.dir');
        if (empty($request->input('search.value'))) {
            $shops = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId);
            })->with("level")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
        } else {
            $search        = $request->input('search.value');
            $shops         = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId);
            })->with("level")->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->get();
            $totalFiltered = \App\User::with("detail")->whereHas('detail', function ($q) use ($userId) {
                $q->where('parents_id', $userId);
            })->with("level")->where('name', 'LIKE', "%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order, $dir)
                ->count();
        }
        $data = array();
        if (!empty($shops)) {
            foreach ($shops as $shop) {
                $aksi = '<a href="rekanan/edit/' . $shop->id . '" class="btn bg-orange btn-xs waves-effect">Edit</a> <a href="rekanan/delete/' . $shop->id . '" class="btn bg-red btn-xs waves-effect">Delete</a>';
                $link = '<a class="btn btn-xs btn-primary detail" data-id="' . $shop->id . '">' . $shop->name . '</a>';

                $data[] = [
                    $link,
                    $shop->email,
                    $shop->detail->address,
                    $shop->detail->phone,
                    $shop->detail->level->name,
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

    public function tambahrekanan()
    {
        return view('home/tambahrekanan');
    }

    public function simpanrekanan(ResellerPost $req)
    {
        $validator = $req->validated();
        if ($validator) {
            $userId             = Auth::user()->id;
            $reseller           = new User();
            $reseller->name     = $req->nama;
            $reseller->email    = $req->email;
            $reseller->password = Hash::make($req->password);
            $reseller->save();
            $id                          = $reseller->id;
            $resellerdtl                 = new UserDetail();
            $resellerdtl->users_id       = $id;
            $resellerdtl->levels_id      = $req->level;
            $resellerdtl->parents_id     = $userId;
            $resellerdtl->address        = $req->alamat;
            $resellerdtl->provinces_id   = $req->propinsiPelanggan;
            $resellerdtl->provinces_name = $req->propinsiName;
            $resellerdtl->citys_id       = $req->kabupatenPelanggan;
            $resellerdtl->citys_name     = $req->kabupatenName;
            $resellerdtl->districts_id   = 0;
            $resellerdtl->districts_name = "";
            $resellerdtl->phone          = $req->telp;
            $resellerdtl->bbm            = $req->line;
            $resellerdtl->wa             = $req->wa;
            $resellerdtl->wa_template    = $req->watemplate;
            $resellerdtl->line           = $req->line;
            $resellerdtl->discount       = $req->diskon;;
            $resellerdtl->is_deposit = 0;
            $resellerdtl->deposit    = 0;
            $resellerdtl->balance    = 0;
            $level = "";
            if ($req->level == "2") {
                $level = "Reseller";
                $resellerdtl->target    = 1500000;
            } else {
                $level = "Marketer";
                $resellerdtl->target    = 500000;
            }

            $resellerdtl->save();
            $req->session()->flash('success', $level . ' ' . $req->nama . ' has been added');
            return redirect('shop/rekanan');
        }
    }

    public function editrekanan($id)
    {
        $data = $shops = \App\User::where('id', $id)->with("detail")->whereHas('detail', function ($q) {})->get();
        return view('home/editrekanan', compact('data'));
    }

    public function updaterekanan(Request $req)
    {
        $userId          = Auth::user()->id;
        $reseller        = User::where('id', $req->idrekanan)->first();
        $reseller->name  = $req->nama;
        $reseller->email = $req->email;
        if (!empty($req->password)) {
            $reseller->password = Hash::make($req->password);
        }
        $reseller->save();
        $id                          = $reseller->id;
        $resellerdtl                 = UserDetail::where('users_id', $req->idrekanan)->first();
        $resellerdtl->users_id       = $id;
        $resellerdtl->levels_id      = $req->level;
        $resellerdtl->parents_id     = $userId;
        $resellerdtl->address        = $req->alamat;
        $resellerdtl->provinces_id   = $req->propinsiPelanggan;
        $resellerdtl->provinces_name = $req->propinsiName;
        $resellerdtl->citys_id       = $req->kabupatenPelanggan;
        $resellerdtl->citys_name     = $req->kabupatenName;
        $resellerdtl->districts_id   = 0;
        $resellerdtl->districts_name = "";
        $resellerdtl->phone          = $req->telp;
        $resellerdtl->bbm            = $req->line;
        $resellerdtl->wa             = $req->wa;
        $resellerdtl->wa_template    = $req->watemplate;
        $resellerdtl->line           = $req->line;
        $resellerdtl->discount       = $req->diskon;;
        $resellerdtl->is_deposit = 0;
        $resellerdtl->balance    = 0;
        $level = "";
        if ($req->level == "2") {
            $level = "Reseller";
            $resellerdtl->target    = 1500000;
        } else {
            $level = "Marketer";
            $resellerdtl->target    = 500000;
        }
        $resellerdtl->save();
        $req->session()->flash('success', $level . ' ' . $req->nama . ' has been update');
        return redirect('shop/rekanan');
    }

    public function deleterekanan($id)
    {
        $data = \App\User::where('id', $id)->first();
        $data->delete();
        return redirect('shop/rekanan');
    }

}

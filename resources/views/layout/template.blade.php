<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- Favicon-->
    <link rel="icon" href="" type="image/x-icon">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="{{mix('/css/core.css')}}" media="screen">
    @yield('plugin-css')
    <link rel="stylesheet" href="{{mix('/css/style.css')}}" media="screen">
    <link rel="stylesheet" href="{{mix('/css/pink.css')}}" media="screen">
</head>

<body class="theme-pink">
<script type="text/javascript">
  var BASE_URL = '{{URL('/')}}';
</script>
<script type="text/javascript">
  var CHART_URL = '{{URL('product/getcart')}}';
</script>
<script type="text/javascript">
  var SPIN_CHART_URL = '{{URL('product/addcart')}}';
</script>
<script type="text/javascript">
  var DELETE_CHART_URL = '{{URL('product/hapuscart')}}';
</script>

<script type="text/javascript">
  var GET_ONGKIR_URL = '{{URL('product/ongkir')}}';
</script>

    <!-- Page Loader -->
    <div class="page-loader-wrapper">
        <div class="loader">
            <div class="preloader">
                <div class="spinner-layer pl-red">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
            <p>Please wait...</p>
        </div>
    </div>
    <!-- #END# Page Loader -->
    <!-- Overlay For Sidebars -->
    <div class="overlay"></div>
    <!-- #END# Overlay For Sidebars -->
    <!-- Search Bar -->
    <div class="search-bar">
        <div class="search-icon">
            <i class="material-icons">search</i>
        </div>
        <input type="text" placeholder="START TYPING...">
        <div class="close-search">
            <i class="material-icons">close</i>
        </div>
    </div>
    <!-- #END# Search Bar -->
    <!-- Top Bar -->
    <nav class="navbar">
        <div class="container-fluid">
            <div class="navbar-header">
                <a href="javascript:void(0);" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></a>
                <a href="javascript:void(0);" class="bars"></a>
                <a class="navbar-brand" href="{{url('/')}}">Aplikasi Agen Galeri Fitri</a>
            </div>
            <div class="collapse navbar-collapse" id="navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <!-- Notifications -->
                    <li class="pull-right">
                        <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button">
                            <i class="material-icons">shopping_cart</i>
                            <span class="label-count jumlah-transaksi">0</span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="header">KERANJANG</li>
                            <li class="body">
                                <ul class="menu" id="keranjangBelanjaDetail">
                                </ul>
                            </li>
                            <li class="footer">
                                <a href="{{ url('product/detailcart') }}" data-popup="tooltip" title="" data-original-title="Proses Keranjang Belanja">Proses Keranjang Belanja</a>
                            </li>
                        </ul>
                    </li>
                    <!-- #END# Notifications -->
                </ul>
            </div>
        </div>
    </nav>
    <!-- #Top Bar -->
    <section>
        <!-- Left Sidebar -->
        <aside id="leftsidebar" class="sidebar">
            <!-- User Info -->
            <div class="user-info">
                <div class="image">
                    <img src="{{ asset('/images/user.jpg') }}" width="48" height="48" alt="User" />
                </div>
                <div class="info-container">
                    <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{Auth::user()->detail->level->name}} {{ Auth::user()->name }} ( {{Auth::user()->detail->discount}}%)</div>
                    <div class="email">
                        {{Auth::user()->email}}
                    </div>
                    <div class="btn-group user-helper-dropdown">
                        <i class="material-icons" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">keyboard_arrow_down</i>
                        <ul class="dropdown-menu pull-right">
                            <li><a href="{{ url('profile') }}"><i class="material-icons">person</i>Profile</a></li>
                            <li><a href="{{url('deposit')}}"><i class="material-icons">account_balance_wallet</i>Deposit</a></li>
                            @if(Auth::user()->detail->levels_id == "1")
                            <li><a href="{{url('isideposit')}}"><i class="material-icons">account_balance_wallet</i>Isi Deposit</a></li>
                            @endif
                            <li><a href="{{url('komisi')}}"><i class="material-icons">pie_chart</i>Komisi</a></li>
                            <li role="seperator" class="divider"></li>
                            <li><a href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();"><i class="material-icons">input</i>Sign Out</a> <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- #User Info -->
            <!-- Menu -->
            <div class="menu">
                <ul class="list">
                    <li class="header">MAIN NAVIGATION</li>
                    <li class="{{ request()->is('/')|| request()->is('home')|| request()->is('deposit*')|| request()->is('isideposit*')|| request()->is('komisi*')|| request()->is('profile*') ? 'active' : '' }}">
                        <a href="/">
                            <i class="material-icons">home</i>
                            <span>Home</span>
                        </a>
                    </li>
                    <li class="{{ request()->is('product*') ? 'active' : '' }}">
                        <a href="{{ url('product') }}">
                            <i class="material-icons">shopping_cart</i>
                            <span>Katalog Produk</span>
                        </a>
                    </li>
                    <li class="{{ request()->is('shop/history*')||request()->is('shop/konfirmasi*')||request()->is('shop/inputresi*') ? 'active' : '' }}">
                        <a href="{{url('shop/history')}}">
                            <i class="material-icons">view_list</i>
                            <span>Data Penjualan</span>
                        </a>
                    </li>
                    @if(Auth::user()->detail->levels_id !== 3)
                    <li class="{{ request()->is('shop/rekanan*')||request()->is('tambahrekanan*') ? 'active' : '' }}">
                            <a href="{{url('shop/rekanan')}}">
                                <i class="material-icons">record_voice_over</i>
                                <span>Rekanan</span>
                            </a>
                    </li>
                    @endif
                    <li class="{{ request()->is('shop/pelanggan*')||request()->is('tambahpelanggan*') ? 'active' : '' }}">
                        <a href="{{url('shop/pelanggan')}}">
                            <i class="material-icons">people</i>
                            <span>Pelanggan</span>
                        </a>
                    </li>
                    <li class="{{ request()->is('shop/laporanmarketer')||request()->is('shop/laporanreseller')||request()->is('shop/laporanpenjualan')? 'active' : '' }}">
                        <a href="javascript:void(0);" class="menu-toggle">
                            <i class="material-icons">trending_up</i>
                            <span>Laporan</span>
                        </a>
                        <ul class="ml-menu">
                            <li class="{{ request()->is('shop/laporanpenjualan') ? 'active' : '' }}">
                                <a href="{{url('shop/laporanpenjualan')}}">
                                    Laporan Penjualan
                                </a>
                            </li>
                            @if(Auth::user()->detail->levels_id == "2" || Auth::user()->detail->levels_id == "1")
                                <li class="{{ request()->is('shop/laporanreseller') ? 'active' : '' }}">
                                    <a href="{{url('shop/laporanreseller')}}">
                                        Laporan Penjualan Reseller
                                    </a>
                                </li>
                            @endif
                            @if(Auth::user()->detail->levels_id == "1")
                            <li class="{{ request()->is('shop/laporanmarketer') ? 'active' : '' }}">
                                <a href="{{url('shop/laporanmarketer')}}">
                                    Laporan Penjualan Marketer
                                </a>
                            </li>
                            @endif
                        </ul>
                    </li>
                    <li class="{{ request()->is('user*') ? 'active' : '' }}">
                        <a href="{{ url('user') }}">
                            <i class="material-icons">shopping_cart</i>
                            <span>Manage User</span>
                        </a>
                    </li>

                </ul>
            </div>
            <!-- #Menu -->
            <!-- Footer -->
            <div class="legal">
                <div class="copyright">
                    &copy; 2018 <a href="javascript:void(0);">Galery Fitri</a>.
                </div>
            </div>
            <!-- #Footer -->
        </aside>
        <!-- #END# Left Sidebar -->
    </section>
    @yield('content')
    <script src="{{ mix('js/core.js') }}"></script>
    @yield('plugin-js')
    <script src="{{ mix('js/admin.js') }}"></script>
    @yield('pages-js')
    <script src="{{ mix('js/demo.js') }}"></script>
</body>

</html>
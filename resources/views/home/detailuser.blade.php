        <form class="form-horizontal form">
            <div class="row clearfix">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">

                <div class="form-group">
                <label  class="col-md-4 control-label">Nama : </label>
                <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->name}}</div>
            </div>
            <div class="form-group">
                <label  class="col-md-4 control-label">Email : </label>
                <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->email}}</div>
            </div>
            <div class="form-group">
                <label  class="col-md-4 control-label">Alamat : </label>
                <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->address}}</div>
            </div>
            <div class="form-group">
                <label  class="col-md-4 control-label">Kota : </label>
                <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->citys_name}}</div>
            </div>
            <div class="form-group">
                <label  class="col-md-4 control-label">Propinsi : </label>
                <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->provinces_name}}</div>
            </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="form-group">
                        <label  class="col-md-4 control-label">BBM : </label>
                        <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->bbm}}</div>
                    </div>
                    <div class="form-group">
                        <label  class="col-md-4 control-label">Line : </label>
                        <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->line}}</div>
                    </div>
                    <div class="form-group">
                        <label  class="col-md-4 control-label">WA : </label>
                        <div  class="col-md-8 form-control-static text-black" id="namaCaption">{{$user->detail->wa}}</div>
                    </div>
                </div>
            </div>
        </form>


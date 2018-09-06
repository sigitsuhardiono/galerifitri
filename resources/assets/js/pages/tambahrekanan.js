$(function () {
    getProvince();
    $(document.body).delegate('#propinsiPelanggan', 'change', function () {
        getCity($(this).val());
        var selectedText = $(this).find("option:selected").text();
        $("#propinsiName").val(selectedText);
    });
    $(document.body).delegate('#kabupatenPelanggan', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#kabupatenName").val(selectedText);
    });
    
    $(document.body).delegate('#save-rekanan', 'click', function () {
        var curInputs = $("#simpan-rekanan").find("input[type='text'][required]"),curSelect = $("#simpan-rekanan").find("select"),isValid = true;
        $(".form-line").removeClass("error-line");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-line").addClass("error-line");
            }
        }

        for(var i=0; i<curSelect.length; i++){
            if (!curSelect[i].validity.valid){
                isValid = false;
                $(curSelect[i]).closest(".form-line").addClass("error-line");
            }
        }
        if(level_user !== "1"){
            if(parseInt(diskon_user) <= parseInt($("#diskon").val())){
                alert("Diskon rekanan tidak boleh lebih dari "+parseInt(diskon_user));
                isValid = false;
            }
        }
        if(isValid){
            $("#simpan-rekanan").submit();
        }
    });

});
function getProvince() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/provinsi",
        method: 'POST',
        success: function (response) {
            $("#propinsiPelanggan").html(response);
            $('.show-tick').selectpicker('refresh');
            $("#idpropinsi").html(response);
        },
        error: function () {
        }
    })
}

function getCity(idprovinsi) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/kota",
        method: 'POST',
        data: {
            idprovinsi: idprovinsi
        },
        success: function (response) {
            $("#kabupatenPelanggan").html(response);
            $('.show-tick').selectpicker('refresh');
        },
        error: function () {
        }
    });
}
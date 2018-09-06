$(function () {
    getProvince("yes");
    getCity(ID_PROVINCE,"yes");
    $(document.body).delegate('#propinsiPelanggan', 'change', function () {
        getCity($(this).val());
        var selectedText = $(this).find("option:selected").text();
        $("#propinsiName").val(selectedText);
    });
    $(document.body).delegate('#kabupatenPelanggan', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#kabupatenName").val(selectedText);
    });

});
function getProvince(type) {
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
            if(type == "yes"){
                $('#propinsiPelanggan option[value="' + ID_PROVINCE + '"]').attr("selected", true);
                var selectedText = $('#propinsiPelanggan').find("option:selected").text();
                $("#propinsiName").val(selectedText);
            }
            $('.show-tick').selectpicker('refresh');
        },
        error: function () {
        }
    })
}

function getCity(idprovinsi,type) {
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
            if(type == "yes"){
                $('#kabupatenPelanggan option[value="' + ID_CITY + '"]').attr("selected", true);
                var selectedText = $("#kabupatenPelanggan").find("option:selected").text();
                $("#kabupatenName").val(selectedText);
            }
            $('.show-tick').selectpicker('refresh');
        },
        error: function () {
        }
    });
}
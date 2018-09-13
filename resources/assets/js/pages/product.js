$(function () {
    $('.image-popup').magnificPopup({
        type: 'image'
    });

    $(".touchspin-data").TouchSpin({
        min: 1,
    });
});
function beliProdukByJumlahCustom() {

    beliProdukByJumlah($('#jumlahCustom').val())

}

function pilihJumlahProduk(id, obj) {
    //if (obj >= 20) obj = Math.round(obj/2)
    $('#jumlahCustom').val(obj);
    $('#idproduk').val(id);
    $('#jumlahSpin').val(1);
    $('#mJumlahProduk').modal('show');
}

function beliProdukByJumlah(jumlah) {

    $('#mJumlahProduk').modal('hide');

    $.blockUI({
        message: '<i class="icon-spinner4 spinner"></i> Silahkan Tunggu',
        overlayCSS: {
            backgroundColor: '#1b2024',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            color: '#fff',
            padding: 0,
            backgroundColor: 'transparent'
        }
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: 'product/addcartmultiple',
        data: {
            id: $('#idproduk').val(),
            jumlah: jumlah
        },
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            $.unblockUI();
            swal(response.title, response.messages, response.status);
            //showNotification(response.status, response.messages, "bottom", "left", "animated fadeIn", "animated fadeOut");
            reloadCart()
        },
        error: function () {
            $.unblockUI();
        }
    })

}

function beliProduk(id, obj) {

    $.blockUI({
        message: '<i class="icon-spinner4 spinner"></i> Silahkan Tunggu',
        overlayCSS: {
            backgroundColor: '#1b2024',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            color: '#fff',
            padding: 0,
            backgroundColor: 'transparent'
        }
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: 'product/add_cart',
        data: {
            id: id
        },
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            $.unblockUI();
            swal(response.title, response.messages, response.status);
            //showNotification(response.status, response.messages, "bottom", "left", "animated fadeIn", "animated fadeOut");
            reloadCart()
        },
        error: function () {
            $.unblockUI();
        }
    })
}

function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) {
    if (colorName === null || colorName === '') {
        colorName = 'bg-black';
    }
    if (text === null || text === '') {
        text = 'Turning standard Bootstrap alerts';
    }
    if (animateEnter === null || animateEnter === '') {
        animateEnter = 'animated fadeInDown';
    }
    if (animateExit === null || animateExit === '') {
        animateExit = 'animated fadeOutUp';
    }
    var allowDismiss = true;

    $.notify({
            message: text
        },
        {
            type: colorName,
            allow_dismiss: allowDismiss,
            newest_on_top: true,
            timer: 1000,
            placement: {
                from: placementFrom,
                align: placementAlign
            },
            animate: {
                enter: animateEnter,
                exit: animateExit
            },
            template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
        });
}
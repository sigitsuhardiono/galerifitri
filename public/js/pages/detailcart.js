$(function () {
    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            curSelect = curStep.find("select"),
            isValid = true;

        $(".form-group").removeClass("has-error");
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

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');
    
    
    getProvince();
    getCustomer();
    $(document.body).delegate('#propinsiPelanggan', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#propinsiName").val(selectedText);
        getCity($(this).val());
    });
    $(document.body).delegate('#kabupatenPelanggan', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#kabupatenNamePelanggan").val(selectedText);
        getCost($("#kabupatenAsal").val(), $(this).val(), $("#beratKiriman").val());
    });
    $(document.body).delegate('#idpropinsi', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#propinsiNameModal").val(selectedText);
        getCityCustomer($(this).val());
    });
    $(document.body).delegate('#idkabupaten', 'change', function () {
        var selectedText = $(this).find("option:selected").text();
        $("#kabupatenNameModal").val(selectedText);
    });
    $(document.body).delegate('#namaPelangganDrop', 'change', function () {
        getCustomerId($(this).val());
    });
    $(".touchspin-data").TouchSpin({
        min: 1,
    });
});

function recalculate(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: SPIN_CHART_URL,
        data: {
            id: id,
            jumlah: $('#jumlah_' + id).val()
        },
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            showNotification(response.status, response.messages, "bottom", "left", "animated fadeIn", "animated fadeOut");
            window.location.reload();
        },
        error: function () {
            $.unblockUI();
        }
    })
}

function hapusData(id) {
    swal({
            title: "Mohon Perhatian",
            text: "Anda yakin akan menghapus item ini ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Ya!",
            cancelButtonText: "Batal",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
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
                $.ajax({
                    url: DELETE_CHART_URL,
                    data: {
                        id: id,
                    },
                    method: 'POST',
                    dataType: 'html',
                    success: function (response) {
                        showNotification(response.status, response.messages, "bottom", "left", "animated fadeIn", "animated fadeOut");
                        window.location.reload();
                    },
                    error: function () {
                        $.unblockUI();
                    }
                })
            }
        });
}

function pilihOngkir(obj) {
    a = $(obj);
    $('#courier').val(a.data('code'));
    $('#ongkosKirimS').val(a.data('service'));
    $('#ongkosKirimF').val(a.data('ongkirf'));
    $('#ongkosKirim').val(a.data('ongkir'));
    $('#ongkosKirimService').val(a.data('desc'));
    $("html, body").animate({
        scrollTop: $(document).height()
    }, "slow");
}

function setButtonWavesEffect(event) {
    $(event.currentTarget).find('[role="menu"] li a').removeClass('waves-effect');
    $(event.currentTarget).find('[role="menu"] li:not(.disabled) a').addClass('waves-effect');
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
    }, {
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
            $("#idpropinsi").html(response);
            $('#propinsiPelanggan').selectpicker('refresh');
            $('#idpropinsi').selectpicker('refresh');
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
            $('#kabupatenPelanggan').selectpicker('refresh');
        },
        error: function () {
        }
    });
}

function getCityCustomer(idprovinsi) {
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
            $("#idkabupaten").html(response);
            $("#idkabupaten").selectpicker('refresh');
        },
        error: function () {
        }
    });
}

function getCost(idorigin, iddestination, berat) {
    $('#ongkosKirimS').val('');
    $('#ongkosKirimF').val('0');
    $('#ongkosKirim').val('0');
    $('#detailKurir').html('');
    if (parseInt($('#kabupatenPelanggan').val()) > 0) {
        $('#detailKurir').html('<tr>' +
            '<td colspan="6"> Silahkan tunggu sebentar... </td>' +
            '</tr>');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: BASE_URL + "/harga",
            method: 'POST',
            dataType: 'json',
            data: {
                idorigin: idorigin,
                iddestination: iddestination,
                berat: berat,
                kurir: "jne"
            },
            success: function (response) {
                //response = $.parseJSON(response);
                console.log(response);
                $('#detailKurir').html('');
                jumlahKurir = 0
                for (i = 0; i < response.rajaongkir.results.length; i++) {
                    console.log(response.rajaongkir.results[i].costs);
                    for (j = 0; j < response.rajaongkir.results[i].costs.length; j++) {
                        jumlahKurir++;
                        ongkir = response.rajaongkir.results[i].costs[j]['cost'][0].value * 1;
                        service = response.rajaongkir.results[i].costs[j]['service']
                        /*if (service.indexOf("JTR") >= 0) continue;*/
                        $('#detailKurir').append('<tr>' +
                            '<td class="text-center"><a class="btn btn-xs btn-default" onclick="pilihOngkir(this)" data-service="' + (response.rajaongkir.results[i].code).toUpperCase() + '' + response.rajaongkir.results[i].costs[j]['service'] + '" ' +
                            ' data-ongkir="' + ongkir + '" ' +
                            ' data-ongkirf="' + addCommas(ongkir) + '" ' +
                            ' data-desc="' + response.rajaongkir.results[i].costs[j]['description'] + '" ' +
                            ' data-code="' + response.rajaongkir.results[i].code + '" ' +
                            ' >Pilih Kurir</a></td>' +
                            '<td class="text-center" nowrap>' + (response.rajaongkir.results[i].code).toUpperCase() + '</td>' +
                            '<td >' + response.rajaongkir.results[i].costs[j]['service'] + '</td>' +
                            '<td>' + response.rajaongkir.results[i].costs[j]['description'] + '</td>' +
                            '<td class="text-right" nowrap>' + addCommas(ongkir) + '</td>' +
                            '<td class="text-center" nowrap>' + response.rajaongkir.results[i].costs[j]['cost'][0].etd + '</td>' +
                            '</tr>');
                    }
                }
                if (jumlahKurir == 0) {
                    $('#detailKurir').html('<tr>' +
                        '<td colspan="6"> Kurir Tidak Ditemukan </td>' +
                        '</tr>');
                }
                console.log(response);
            },
            error: function () {
            }
        });
    } else {
        $('#detailKurir').html('<tr>' +
            '<td colspan="6"> Pilih Kota Pengiriman </td>' +
            '</tr>');
    }
}

function newCustomer() {
    $('#mNewCustomer').modal('show');
}

function onChangeDataPelanggan(pelanggan) {
    console.log(pelanggan);
    $.blockUI({
        message: 'Memproses Pelanggan',
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
    $("#namaPelanggan").val(pelanggan.name);
    $("#telpPelanggan").val(pelanggan.phone);
    $("#alamatPelanggan").text(pelanggan.address);
    $("#propinsiPelanggan option[value='" + pelanggan.province + "']").attr("selected", true);
    $('#propinsiPelanggan').selectpicker('refresh');
    $("#propinsiNamePelanggan").val(pelanggan.province_name);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/kota",
        method: 'POST',
        data: {
            idprovinsi: pelanggan.province
        },
        success: function (response) {
            $("#kabupatenPelanggan").html(response);
            $('#kabupatenPelanggan option[value="' + pelanggan.city + '"]').attr("selected", true);
            $('#kabupatenPelanggan').selectpicker('refresh');
            $("#kabupatenNamePelanggan").val(pelanggan.city_name);
            getCost($("#kabupatenAsal").val(), pelanggan.city, $("#beratKiriman").val());
        },
        error: function () {
        }
    });
    setTimeout(function () {
        $.unblockUI();
    }, 2500);
}

function saveNewCustomer() {
    swal({
            title: "Konfirmasi",
            text: "Anda yakin akan menyimpan pelanggan ?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Ya!",
            cancelButtonText: "Batal",
            closeOnCancel: true,
            showLoaderOnConfirm: true
        },
        function (isConfirm) {
            if (isConfirm) {
                var isValid;
                $("#frmPelanggan").find("input[type=text],input[type=number],input[type=hidden],textarea").each(function() {
                    var element = $(this);
                    if (element.val() == "") {
                        $(this).parent().addClass("error-line");
                        isValid = false;
                    }
                    else{
                        $(this).parent().removeClass("error-line");
                        isValid = true;
                    }
                });
                if(isValid == false){
                    return false;
                }
                $('#mNewCustomer').modal('hide');
                $.blockUI({
                    message: '<i class="icon-spinner4 spinner"></i> Memproses Pelanggan Baru',
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
                    url: BASE_URL + "/shop/proses_pelanggan",
                    data: $('#frmPelanggan').serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function (response) {
                        if (response.status == true) {
                            $.unblockUI();
                            $.ajax({
                                url: BASE_URL + "/customer",
                                method: 'POST',
                                success: function (responsepel) {
                                    $("#namaPelangganDrop").html(responsepel);
                                    $('#namaPelangganDrop option[value="' + response.id + '"]').attr("selected", true);
                                    $('#namaPelangganDrop').selectpicker('refresh');
                                },
                                error: function () {
                                }
                            });
                            onChangeDataPelanggan(response.data);
                        } else {
                            $.unblockUI();
                            swal({
                                    title: "Mohon Perhatian",
                                    text: "Kontak Gagal dimasukkan",
                                    type: "warning",
                                    showCancelButton: false,
                                    confirmButtonColor: "#EF5350",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                function (isConfirm) {
                                    $('#mNewCustomer').modal('show');
                                });
                        }
                    },
                    error: function () {
                        $.unblockUI();
                        swal({
                                title: "Mohon Perhatian",
                                text: "Kontak Gagal dimasukkan",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#EF5350",
                                confirmButtonText: "OK",
                                closeOnConfirm: true,
                                closeOnCancel: true
                            },
                            function (isConfirm) {
                                $('#mNewCustomer').modal('show');
                            });
                    }
                })
            }
        });
}

function formatResultData(current) {
    if (!current.id) return current.text;
    return "<b>" + current.nama + '</b><br><small>' + current.alamat + '<small>';
}

function formatResultSelection(current) {
    if (!current.id) return current.nama;
    return current.nama;
}

function getCustomer() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/customer",
        method: 'POST',
        success: function (response) {
            $("#namaPelangganDrop").html(response);
            $('#namaPelangganDrop').selectpicker('refresh');
        },
        error: function () {
        }
    })
}

function getCustomerId(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: BASE_URL + "/customerid",
        method: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function (response) {
            onChangeDataPelanggan(response.data)
        },
        error: function () {
        }
    })
}
function depositTidakAda(){
    setTimeout(function(){
        swal({
                title: "Isi Dompet Tidak mencukupi !",
                text: "",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Ya!",
                cancelButtonText: "",
                closeOnCancel: true,
                showLoaderOnConfirm: true
            },
            function(isConfirm){
                if (isConfirm) {
                }
                /*window.location.reload()*/
            })
    }, 500);
}
function konfirmasiTransfer(){
    swal({
            title: "Konfirmasi Transaksi ?",
            text: "Anda yakin akan memproses  ?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Ya!",
            cancelButtonText: "Batal",
            closeOnCancel: true,
            showLoaderOnConfirm: true
        },
        function(isConfirm){
            if (isConfirm) {
                var dataBank = $('#bank').val()
                var dataTanggalTransfer = $('#tgl_transfer').val()
                $('#konfirmasiTransaksi').modal('hide');
                $.blockUI({
                    message: '<i class="icon-spinner4 spinner"></i> Memproses Transaksi',
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
                    url: BASE_URL+'/shop/konfirmasitransfer',
                    data: {
                        id: ID_TRANS,
                    },
                    method: 'POST',
                    dataType: 'html',
                    success: function (response){
                        console.log(response)
                        $.unblockUI();
                        if (response != '') {
                            console.log('TESSSS')
                            depositTidakAda()
                        } else {
                            console.log('XXXX')
                            window.location.reload()
                        }

                    },
                    error: function(){
                        $.unblockUI();
                        console.log('ERROR')
                        window.location.reload()
                    }
                })
            }
        });

}
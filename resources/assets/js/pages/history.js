$(function () {
    var tglAwal = $("#tgl_awal").val();
    var tglAkhir = $("#tgl_akhir").val();
    var keyword = $("#keyword").val();

    $('.date').bootstrapMaterialDatePicker({
        format: 'YYYY-MM-DD',
        clearButton: true,
        weekStart: 1,
        time: false
    });

    $('.count-to').countTo({
        formatter: function (value, options) {
            value = value.toFixed(options.decimals);
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return value;
        }
    });

    var table = $('#js-history').dataTable({
        dom: 'Bfrtip',
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        bFilter: false,
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/showtransaction?keyword=" + keyword + "&startdate=" + tglAwal + "&enddate=" + tglAkhir,
        columnDefs: [
            {
                "targets": [4],
                "visible": false
            }, {
                "targets": [5],
                "visible": false
            }, {
                "targets": [7],
                "visible": false
            },
            {
                "targets": [8],
                "visible": false
            }
        ],
        "drawCallback": function (settings) {
            $('.invoice').on('click', function (e) {
                e.preventDefault();
                $('.invoice-body').html('<p>Loading...</p>')
                $('#invoiceData').modal('show').find('.modal-body').load(BASE_URL + '/shop/detail/' + $(this).data('id'));
            });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/\D/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column(6)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            totalDiskon = api
                .column(7)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            totalProduk = api
                .column(8)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            // Update footer
            $("#total-penjualan").text(addCommas(total));
            $(api.column(6).footer()).html(
                addCommas(total)
            );

            $("#total-diskon").text(addCommas(totalDiskon));
            $("#total-transaksi").text(addCommas(api.column(0).data().count()));
            $("#total-produk").text(addCommas(totalProduk));
        }
    });

    $("#btn_cari").on('click', function (e) {
        var tglAwal = $("#tgl_awal").val();
        var tglAkhir = $("#tgl_akhir").val();
        var keyword = $("#keyword").val();
        var setRepot = table.fnSettings();
        setRepot.ajax = BASE_URL + "/showtransaction?keyword=" + keyword + "&startdate=" + tglAwal + "&enddate=" + tglAkhir;
        table.fnDraw();
    });

    $('.waybill').on('click', function (e) {
        e.preventDefault();
        $('.waybill-body').html('<p>Loading...</p>')
        $('#waybillData').modal('show').find('.modal-body').load(base_url + 'shop/waybill/' + $(this).data('id'));
    });

});
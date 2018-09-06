$(function () {
    var bulan = $("#bulan").val();
    var tahun = $("#tahun").val();
    var keyword = $("#keyword").val();

    //Exportable table
    var table = $('#js-reseller').dataTable({
        dom: 'Bfrtip',
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/showlaporanpenjualan?keyword="+ keyword + "&bulan=" + bulan + "&tahun=" + tahun,
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        drawCallback: function (settings) {
            $('.detail').on('click', function (e) {
                e.preventDefault();
                $('.detail-body').html('<p>Loading...</p>')
                $('#detailData').modal('show').find('.modal-body').load(BASE_URL + '/marketer/detail/' + $(this).data('id'));
            });
        },
        "columnDefs": [
            {"className": "dt-center", "targets": 3},
            { "orderable": false, "targets": [ 1,2,3 ] }
        ]
    });

    $("#btn_cari").on('click', function (e) {
        var bulan = $("#bulan").val();
        var tahun = $("#tahun").val();
        var keyword = $("#keyword").val();
        var setRepot = table.fnSettings();
        setRepot.ajax = BASE_URL + "/showlaporanpenjualan?keyword="+ keyword + "&bulan=" + bulan + "&tahun=" + tahun;
        table.fnDraw();
    });

});
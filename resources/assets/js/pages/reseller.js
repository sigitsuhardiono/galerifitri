$(function () {
    //Exportable table
    var table = $('#js-reseller').dataTable({
        dom: 'Bfrtip',
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/showreseller",
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        drawCallback: function (settings) {
            $('.detail').on('click', function (e) {
                e.preventDefault();
                $('.detail-body').html('<p>Loading...</p>')
                $('#detailData').modal('show').find('.modal-body').load(BASE_URL + '/reseller/detail/' + $(this).data('id'));
            });
        },
        "columnDefs": [
            {"className": "dt-center", "targets": 4}
        ],
    });
});
$(function () {
    //Exportable table
    $('#js-pelanggan').dataTable({
        dom: 'Bfrtip',
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/showpelanggan",
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        "drawCallback": function( settings ) {
            var api = this.api();
            console.log( api );
        },
        "columnDefs": [
            {"className": "dt-center", "targets": 6}
        ]
    });
});
$(function () {
    //Exportable table
    $('#js-brand').dataTable({
        dom: 'Bfrtip',
        processing: true,
        serverSide: true,
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        ajax: BASE_URL + "/showbrand",
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        "drawCallback": function( settings ) {
            var api = this.api();
            console.log( api );
        }
    });
});
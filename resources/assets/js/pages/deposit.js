$(function () {
    //Exportable table
    $('#js-deposit').dataTable({
        dom: 'Bfrtip',
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/showdeposit",
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        "drawCallback": function( settings ) {
            var api = this.api();
            console.log( api );
        }
    });
});
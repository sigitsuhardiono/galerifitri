$(function () {
    //Exportable table
    $('#js-komisi').dataTable({
        dom: 'Bfrtip',
        processing: true,
        serverSide: true,
        responsive: true,
        rowReorder: {
            selector: 'td:nth-child(1)'
        },
        ajax: BASE_URL + "/showkomisi",
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        "drawCallback": function( settings ) {
            var api = this.api(), data;
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/\D/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            total = api
                .column(2)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            $("#total-komisi").text(addCommas(total));
        }
    });
});
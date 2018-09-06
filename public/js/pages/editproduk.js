$(function () {
    var detail = '<tr class="detail">'+
        '<td>'+
        '<div class="form-group">'+
        '<div class="form-line">'+
        '<input type="hidden" name="iddetail[]" value="">'+
        '<input type="text" class="form-control" name="size[]" placeholder="Size">'+
        '</div>'+
        '</div>'+
        '</td>'+
        '<td>'+
        '<div class="form-group">'+
        '<div class="form-line">'+
        '<input type="text" class="form-control" name="stok[]" placeholder="Stok">'+
        '</div>'+
        '</div>'+
        '</td>'+
        '<td>'+
        '<div class="form-group">'+
        '<div class="form-line">'+
        '<input type="text" class="form-control" name="harga[]" placeholder="Harga">'+
        '</div>'+
        '</div>'+
        '</td>'+
        '<td>'+
        '<div class="form-group">'+
        '<div class="form-line">'+
        '<input type="text" class="form-control" name="berat[]" placeholder="Berat">'+
        '</div>'+
        '</div>'+
        '</td>'+
        '<td>'+
        '<button type="button" class="btn bg-red btn-circle waves-effect waves-circle waves-float remove">'+
        '<i class="material-icons">delete</i>'+
        '</button>'+
        '</td>'+
        '</tr>';
    //Dropzone
    Dropzone.options.frmFileUpload = {
        paramName: "file",
        maxFilesize: 2
    };
    $(".add").click(function () {
        $('#item_table').append(detail);
    });

    $(document).on('click', '.remove', function(){
        $(this).closest('tr').remove();
    });
});

summe();
$(".rmitem").click(function () {

    $.ajax({
        url: '/cart?id=' + $(this).attr('id').split("rmbtn_")[1]
        , type: 'PATCH'
        , function (data) {

        }
    });
    $(this).closest('tr')
        .children('td')
        .animate({
            padding: 0
        })
        .wrapInner('<div />')
        .children()
        .slideUp(function () {
            $(this).closest('tr').remove();
            summe();
        });
});
$(".upitem").click(function () {
    var myid = $(this).attr('id').split("upbtn_")[1];
    $.post("/cart", {
        id: myid
        , qty: $('#qtyin_' + myid).val()
    });
    summe();
    BootstrapDialog.show({
        message: 'Produkt geändert.'
        , title: 'Warenkorb'
        , type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        buttons: [{
            label: 'OK'
            , action: function (dialogItself) {
                dialogItself.close();
            }
                        }]
    });
});

function summe() {
    var foo = document.getElementsByClassName('articlePrice');
    var bar = 0;
    for (var i = 0; i < foo.length; i++) {
        bar += parseFloat(foo[i].innerHTML.split(' €')[0]) * parseFloat(foo[i].parentNode.getElementsByClassName('form-control text-center')[0].value);
    }
    document.getElementById('insgesamtTD').innerHTML = '<strong>Insgesamt: ' + bar + " €</strong>";
    return;
}
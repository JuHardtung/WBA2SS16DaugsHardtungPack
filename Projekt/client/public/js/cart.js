summe();
$(".rmitem").click(function () {
    var obj = $(this);
    $.ajax({
            url: '/cart?id=' + $(".rmitem").attr('id').split("rmbtn_")[1]
            , type: 'PATCH'
        })
        .done(function (data) {
          obj.closest('tr')
                .children('td')
                .animate({
                    padding: 0
                })
                .wrapInner('<div />')
                .children()
                .slideUp(function () {
                    obj.closest('tr').remove();
                    summe();
                    if ($('.rmitem').length == 0) {
                        $('.errormsg').removeClass('hide');
                    }
                });
        })
        .fail(function (data) {
            console.log(data.responseText);
            var res = JSON.parse(data.responseText);
            BootstrapDialog.show({
                message: res.msg
                , title: 'Fehler: ' + res.code
                , type: BootstrapDialog.TYPE_DANGER
                , buttons: [{
                    label: 'OK'
                    , action: function (dialogItself) {
                        dialogItself.close();
                    }
                        }]
            });
        });
});


$("#deleteCartBtn").click(function () {
    $.ajax({
            url: '/cart'
            , type: 'DELETE'
        })
        .done(function (data) {
          $(".rmitem").closest('tr')
                .children('td')
                .animate({
                    padding: 0
                })
                .wrapInner('<div />')
                .children()
                .slideUp(function () {
                    $(".rmitem").closest('tr').remove();
                    summe();
                    if ($('.rmitem').length == 0) {
                        $('.errormsg').removeClass('hide');
                    }
                });
        })
        .fail(function (data) {
            console.log(data.responseText);
            var res = JSON.parse(data.responseText);
            BootstrapDialog.show({
                message: res.msg
                , title: 'Fehler: ' + res.code
                , type: BootstrapDialog.TYPE_DANGER
                , buttons: [{
                    label: 'OK'
                    , action: function (dialogItself) {
                        dialogItself.close();
                    }
                        }]
            });
        });
});


$(".upitem").click(function () {

    var myid = $(this).attr('id').split("upbtn_")[1];
    $.post("/cart", {
            id: myid
            , qty: $('#qtyin_' + myid).val()

        }, function (data) {})
        .done(function (data) {
            BootstrapDialog.show({
                message: 'Produkt aktualisiert!'
                , title: 'Warenkorb'
                , type: BootstrapDialog.TYPE_WARNING
                , buttons: [{
                    label: 'OK'
                    , action: function (dialogItself) {
                        dialogItself.close();
                    }
                        }]
            });
            summe();
        })
        .fail(function (data) {
            var res = JSON.parse(data.responseText);
            BootstrapDialog.show({
                message: res.msg
                , title: 'Fehler: ' + res.code
                , type: BootstrapDialog.TYPE_DANGER
                , buttons: [{
                    label: 'OK'
                    , action: function (dialogItself) {
                        dialogItself.close();
                    }
                        }]
            });
        });
});

$(".checkout").click(function () {
    $.get("/cart/checkout", function (data) {})
        .done(function (data) {
            $('tbody').hide();
            $('.errormsg').removeClass('hide');
        })
        .fail(function (data) {
            var res = JSON.parse(data.responseText);
            BootstrapDialog.show({
                message: res.msg
                , title: 'Fehler: ' + res.code
                , type: BootstrapDialog.TYPE_DANGER
                , buttons: [{
                    label: 'OK'
                    , action: function (dialogItself) {
                        dialogItself.close();
                    }
          }]
            });
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

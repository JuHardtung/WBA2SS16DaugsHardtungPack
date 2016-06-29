
$(".rmitem").click(function () {
    var obj = $(this);
    $.ajax({
            url: '/user?id=' + $(this).attr('id').split("rmbtn_")[1]
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

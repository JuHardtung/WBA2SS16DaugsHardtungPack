$.fn.toggleAttr = function(attr) {
 return this.each(function() {
  var $this = $(this);
  $this.attr(attr) ? $this.removeAttr(attr) : $this.attr(attr, attr);
 });
};


$("#abort").click(function () {
    window.location.href = "/";

});

$("#categoryCheck").change(function () {
$("#categorySelect").toggleAttr('disabled');
$("#categoryInput").toggleAttr('disabled');
});

$("#saveArticle").click(function () {
    var name = $("#nameInput").val();
    var descr = $("#descrInput").val();
    var price = $("#priceInput").val();
    var storage = $("#storageInput").val();
    var category;
    if ($("#categoryInput").attr('disabled')) {
      category = $("#categorySelect").val();
    }else{
      category = $("#categoryInput").val();
    }




    if (name == '') {
        $('#nameInput').css("border", "2px solid red");
        $('#nameInput').css("box-shadow", "0 0 3px red");
    }
    if (descr == '') {
        $('#descrInput').css("border", "2px solid red");
        $('#descrInput').css("box-shadow", "0 0 3px red");
    }
    if (price == '') {
        $('#priceInput').css("border", "2px solid red");
        $('#priceInput').css("box-shadow", "0 0 3px red");
    }
    if (storage == '') {
        $('#storageInput').css("border", "2px solid red");
        $('#storageInput').css("box-shadow", "0 0 3px red");
    }
    if (category == '') {
        $('#categorySelect').css("border", "2px solid red");
        $('#categorySelect').css("box-shadow", "0 0 3px red");
    }
    $.post("/article", {
            name: name
            , descr: descr
            , price: price
            , storage: storage
            ,category :category
        }
        , function (data) {})

    .done(function (data) {
            $('#nameInput').after('<p class="signup">Artikel hinzufügen erfolgreich!</p>');
            window.location.href = "/";
        })
        .fail(function (data) {
            var res = JSON.parse(data.responseText);
            $('#nameInput').css("border", "2px solid red");
            $('#nameInput').css("box-shadow", "0 0 3px red");
            //$('#nameInput').after('<p class="user">Artikel hinzufügen nicht erfolgreich!</p>');
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
        })

});

 $(".add").click(function () {
     if (!$(this).hasClass("disabled")) {
         var anzahl = parseInt($('#quantity').val());
         $.post("/cart", {
                 id: $(this).attr("data-id")
                 , qty: anzahl
            }, function (data) {})
                 .done(function (data) {
                     BootstrapDialog.show({
                         message: 'Produkt zum Warenkorb hinzugefügt!'
                         , title: 'Warenkorb'
                         , type: BootstrapDialog.TYPE_WARNING
                         , buttons: [{
                             label: 'OK'
                             , action: function (dialogItself) {
                                 dialogItself.close();
                             }
                        }]
                     });
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
         }
     });
 $(document).ready(function () {
     var foopic = document.getElementById('bild');
     var bar = foopic.firstChild;
     var keyword = bar.id.split("_image")[0];
         $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                 tags: keyword
                 , tagmode: "any"
                 , format: "json"
             }
             , function (data) {
                 var rnd = Math.floor(Math.random() * data.items.length);
                 var image_src = data.items[rnd].media.m.replace("_m", "_b");
                 bar.setAttribute("src", image_src);
             });
 });
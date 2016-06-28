 $(document).ready(function () {

     $(".add").click(function () {
         if (!$(this).hasClass("disabled")) {
             $.post("/cart", {
                     id: $(this).attr("data-id")
                     , qty: 1
                 }
                 , function (data) {
                     if (data == "OK") {
                         BootstrapDialog.show({
                             message: 'Produkt zum Warenkorb hinzugefügt!'
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
                     } else {
                         BootstrapDialog.show({
                             message: 'Beim hinzufügen zum Warenkorb ist ein Fehler aufgetreten! Sorry :*'
                             , title: 'Warenkorb'
                             , type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                             closable: true, // <-- Default value is false
                             draggable: true, // <-- Default value is false
                             buttons: [{
                                 label: 'OK'
                                 , action: function (dialogItself) {
                                     dialogItself.close();
                                 }
                        }]
                         });
                     }
                 });
         }
     });

     $(".delete").click(function () {
         var obj = $(this);
         $.ajax({
             url: '/article'
             , type: 'DELETE'
             , data: {
                 id: $(this).attr("data-id")
             }
         }).success(function (data) {
             obj.closest('.thumbnail').parent().fadeOut("slow", function () {
                 obj.closest('.thumbnail').parent().remove();
                 if ($('.ratings').length == 0) {
                     $('.errormsg').removeClass('hide');
                 }
             });

             BootstrapDialog.show({
                 message: data
                 , title: 'Artikel'
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
     });


     var foopics = document.getElementsByClassName('bild');
     for (var i = 0; i < foopics.length; i++) {
         (function (i) { 
              var bar = foopics[i].firstChild;
         var keyword = bar.id.split("_image")[0];
             $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?', {
                 tags: keyword
                 , tagmode: "any"
                 , format: "json"
                 , async: false
             }, function (data) {
                 var rnd = Math.floor(Math.random() * data.items.length);
                 var image_src = data.items[rnd].media.m.replace("_m", "_b");
                 bar.setAttribute("src", image_src);
             });
         })(i);
     }


 });

    alert(image_scr);
    var keyword = "banane";

    $(document).ready(function() {

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: keyword,
                tagmode: "any",
                format: "json"
            },
            function(data) {
                var rnd = Math.floor(Math.random() * data.items.length);

                var image_src = data.items[rnd].media.m.replace("_m", "_b");

                $('#<%= articles[i].name %>_image').attr("hallo","lalal");



            });

    });

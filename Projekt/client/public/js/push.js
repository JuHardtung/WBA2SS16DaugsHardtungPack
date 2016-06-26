            $("#push").click(function() {
                var msg = $('#msg').val();
                var client = new Faye.Client("http://localhost:10000/faye");
                var publishMsg = client.publish('/news', {
                        "author": "Admin",
                        "content": msg
                    })
                    .then(
                        function() {

                        },
                        function(error) {

                        }


                    );

            });
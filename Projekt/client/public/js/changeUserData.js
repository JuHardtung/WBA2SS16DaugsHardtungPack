$("#changePwd").click(function () {
                var password = $("#inputPassword").val();
                if (password == '') {
                    $('#inputPassword').css("border", "2px solid red");
                    $('#inputPassword').css("box-shadow", "0 0 3px red");
                }
                $.post("/settings", {

                        password: password,
                    },
                    function (data) {
                        if (data == 'password change failed') {
                            $('#password').css("border", "2px solid red");
                            $('#password').css("box-shadow", "0 0 3px red");
                            $('#password').after('<p class="user">Password wechseln nicht erfolgreich!</p>');

                        } else {
                            $('#changePwd').after('<p class="signup">Password ändern erfolgreich!</p>');
                        }
                    });
            });
            $("#changeMail").click(function () {
                var mail = $("#inputMail").val();
                if (mail == '') {
                    $('#inputMail').css("border", "2px solid red");
                    $('#inputMail').css("box-shadow", "0 0 3px red");
                }
                $.post("/settings", {

                        mail: mail,
                    },
                    function (data) {
                        if (data == 'mail change failed') {
                            $('#mail').css("border", "2px solid red");
                            $('#mail').css("box-shadow", "0 0 3px red");
                            $('#mail').after('<p class="user">Mail wechseln nicht erfolgreich!</p>');

                        } else {
                            $('#changeMail').after('<p class="signup">Mail ändern erfolgreich!</p>');
                        }
                    });
            });
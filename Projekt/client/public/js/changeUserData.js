$("#changePwd").click(function () {
    var password = $("#inputPassword").val();

    if (password == '') {
        $('#answerPwdOK').remove();
        $('#inputPassword').css("border", "2px solid red");
        $('#inputPassword').css("box-shadow", "0 0 3px red");
        $('#changePwd').after('<p id="answerPwdFailed">Geben Sie bitte ein Passwort an!</p>');
        $('#answerPwdFailed').css("color", "red");
        return;
    }
    $.post("/settings", {

            password: password,
        },
        function (data) {
            if (data == 'password change failed') {
                $('#answerPwdOK').remove();
                $('#inputPassword').css("border", "2px solid red");
                $('#inputPassword').css("box-shadow", "0 0 3px red");
                $('#changePwd').after('<p id="answerPwdFailed">Password wechseln nicht erfolgreich!</p>');
                $('#answerPwdFailed').css("color", "red");

            } else {
                $('#answerPwdFailed').remove();
                $('#inputPassword').css("border", "2px solid green");
                $('#inputPassword').css("box-shadow", "0 0 3px green");
                $('#changePwd').after('<p id="answerPwdOK">Password ändern erfolgreich!</p>');
                $('#answerPwdOK').css("color", "green");
            }
        });
});
$("#changeMail").click(function () {
    var mail = $("#inputMail").val();

    if (mail == '') {
        $('#answerMailOK').remove();
        $('#inputMail').css("border", "2px solid red");
        $('#inputMail').css("box-shadow", "0 0 3px red");
        $('#changeMail').after('<p id="answerMailFailed">Geben Sie bitte eine E-Mail-Adresse an!</p>');
        $('#answerMailFailed').css("color", "red");
        return;
    }
    $.post("/settings", {

            mail: mail,
        },
        function (data) {
            if (data == 'mail change failed') {
                $('#answerMailOK').remove();
                $('#inputMail').css("border", "2px solid red");
                $('#inputMail').css("box-shadow", "0 0 3px red");
                $('#changeMail').after('<p id="answerMailFailed">Mail wechseln nicht erfolgreich!</p>');
                $('#answerMailFailed').css("color", "red");

            } else {
                $('#answerMailFailed').remove();
                $('#inputMail').css("border", "2px solid green");
                $('#inputMail').css("box-shadow", "0 0 3px green");
                $('#changeMail').after('<p id="answerMailOK">Mail ändern erfolgreich!</p>');
                $('#answerMailOK').css("color", "green");
            }
        });
});
 $(document).ready(function() {

    $('#login').click(function() {
        var user = $("#inputUser").val();
        var password = $("#inputPassword").val();
        var remember = $("#remember").val();
        $.post("/login", {
                userName: user,
                password: password,
                remember: remember
            },
            function(data, status) {
                if(data=="OK"){
                  location.reload();
                }else{
                  BootstrapDialog.show({
                      message: 'Falscher Username oder Passwort!'
                      , title: 'Login Fehler'
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
    });
    }); 
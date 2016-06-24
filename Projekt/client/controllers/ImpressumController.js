module.exports = {

    impressum: function (req, res) {
        var data = {
            title: 'Impressum',
            session: req.session
        };
        res.render('impressum', data);
    }
}
var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/members', (req, res) =>{
        const buttonsData = [
            { route: 'prebuiltOptions', description: 'Build Your PC' },
            { route: 'categories', description: 'Compare Parts' },
            { route: 'info', description: 'Info' }
        ];
        res.render('members', { buttons: buttonsData });
        // res.render('templates/notification_page.ejs', {message:'Your name has been changed.'})
    })
}
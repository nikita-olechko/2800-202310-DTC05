var express = require('express');
router = express.Router();

module.exports = async function (app, userCollection, Joi, bcrypt,) {
    app.get('/login', (req, res) => {
        // If the user is already logged in, redirect to the members page
        if (req.session.user) {
            res.redirect('/');
            return;
        }
        res.render("login");
    });

    app.post('/login', async (req, res) => {
        const {
            username,
            password
        } = req.body;

        // Validate input
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        const validationResult = schema.validate({
            username,
            password
        });
        if (validationResult.error) {
            res.status(400).render('templates/notification_page.ejs', {message:'Invalid username or password.'});
            return;
        }

        // Check if username exists
        const existingUser = await userCollection.findOne({
            username: username
        });
        if (!existingUser) {
            res.status(401).render('templates/notification_page.ejs', {message:'invalid username or password.'});
            return;
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(401).render('templates/notification_page.ejs', {message:'Invalid username or password.'});
            return;
        }

        // Log in user
        req.session.user = existingUser;

        // Redirect to members area
        if (existingUser.user_type === 'admin') {
            const result = await userCollection.find({}).toArray();
            res.render('admin', { user: req.session.user, users: result });
            return;
        }
        res.redirect('/');
    });

};
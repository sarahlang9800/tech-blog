
const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newUserData = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.user_id = newUserData.id;
            req.session.username = newUserData.username;
            req.session.logged_in = true;
            res.status(200).json(newUserData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const newUserData = await User.findOne({ where: { username: req.body.username } });

        if (!newUserData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await newUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = newUserData.id;
            req.session.username = newUserData.username;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json({ message: 'No account with that username was found!'});
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
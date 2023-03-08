const router = require('express').Router();
const { Blog, Comment, User } = require('../models');

// custom middleware
const withAuth = require('../utils/auth');

// 
router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [Blog],
    });

    const blogs = blogData.map((blog) =>
      blog.get({ plain: true })
    );

    res.render('all-blogs', {blogs});

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [
            User
          ],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    res.render('single-blog', { blog });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');
  });

module.exports = router;
const router = require('express').Router();
const { Blog, User, Comment } = require('../models/');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      where: {
        userId: req.session.userId,
      },
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('all-blogs', {
      layout: 'dashboard',
      blogs,
    });
  } catch (err) {
    res.redirect('login');
  }
});

router.get('/new', withAuth, (req, res) => {
  res.render('new-blog', {
    layout: 'dashboard',
  });
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id);

    if (blogData) {
      const blog = blogData.get({ plain: true });

      res.render('edit-blog', {
        layout: 'dashboard',
        blog,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
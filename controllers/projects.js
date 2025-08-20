const express = require('express');
const router = express.Router();

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);


// index action
// GET /projects
// Example of a non-protected route
router.get('/', async (req, res) => {
  try{
    const projects = await Project.find({});
    res.render('projects/index', { projects, user: req.user})
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /projects/new
// Example of a protected route
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('projects/new', { user: req.user });
});

module.exports = router;
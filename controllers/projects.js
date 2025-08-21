const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);


// index action
// GET /projects
// Example of a non-protected route
router.get('/', async (req, res) => {
  try{
    const filter = {};

    if (req.query.tag && req.query.tag !== 'All') {
      filter.tags = req.query.tag;
    }

    if (req.query.tech && req.query.tech !== 'All') {
      filter.technologies = req.query.tech;
    }
    const projects = await Project.find(filter);
    const allTags = Project.schema.path('tags').caster.enumValues;
    const allTech = await Project.distinct('technologies');

    res.render('projects/index', { 
      title: 'Projects',
      projects,
      user: req.user,
      allTags,
      allTech,
      selectedTag: req.query.tag || 'All',
      selectedTech: req.query.tech || 'All'
    })
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

router.post('/', ensureLoggedIn, async (req, res) => {
  try {
     req.body.teamProject = req.body.teamProject === 'on';

    if (req.body.technologies) {
      req.body.technologies = req.body.technologies.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      req.body.technologies = [];
    }

    if (!Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags ? [req.body.tags] : [];
    }

    req.body.createdBy = req.user._id;

    const newProject = await Project.create(req.body);
    res.redirect(`/projects/${newProject._id}`);
  } catch (err) {
    console.error('Project creation failed:', err);
    res.status(400).send('Project creation failed');
  }
});

router.get('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy');
    res.render('projects/show', { project, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(404).send('Project not found');
  }
});

router.get('/:id/edit', ensureLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project.createdBy.equals(req.user._id)) {
      return res.status(403).send('Unauthorized');
    }

    res.render('projects/edit', { project, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(404).send('Project not found');
  }
});

router.put('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project.createdBy.equals(req.user._id)) {
      return res.status(403).send('Unauthorized');
    }

    await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/projects/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(400).send('Project update failed');
  }
});

router.delete('/:id', ensureLoggedIn, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project.createdBy.equals(req.user._id)) {
      return res.status(403).send('Unauthorized');
    }

    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.status(400).send('Project deletion failed');
  }
});

module.exports = router;
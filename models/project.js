const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  technologies: {
    type: [String],
    default: [],
  },
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  teamProject: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: [],
    enum: ['SaaS', 'AI', 'E-commerce', 'Business Site', 'Showcase', 'Game', 'Other'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
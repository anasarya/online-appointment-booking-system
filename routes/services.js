const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const services = await Service.find(query)
      .populate('staffMembers', 'firstName lastName specialization')
      .sort({ name: 1 });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('staffMembers', 'firstName lastName specialization');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create new service
// @access  Private (Admin only)
router.post('/', [
  auth,
  adminAuth,
  body('name').notEmpty().withMessage('Service name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, duration, price, category, staffMembers, image } = req.body;

    const service = new Service({
      name,
      description,
      duration,
      price,
      category,
      staffMembers: staffMembers || [],
      image: image || ''
    });

    await service.save();
    await service.populate('staffMembers', 'firstName lastName specialization');

    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  adminAuth
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, description, duration, price, category, staffMembers, image, isActive } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (duration) service.duration = duration;
    if (price) service.price = price;
    if (category) service.category = category;
    if (staffMembers) service.staffMembers = staffMembers;
    if (image !== undefined) service.image = image;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();
    await service.populate('staffMembers', 'firstName lastName specialization');

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/categories/list
// @desc    Get all service categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
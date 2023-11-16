const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');

// Hashing difficulty level
const saltRounds = 10;

// Validation rules
const createUserValidationRules = [
    // username
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('username').isLength({ max: 20 }).withMessage('Username cannot be longer than 20 characters'),
    body('username').matches(/^\S*$/).withMessage('Username cannot contain whitespace'),

    // email
    body('email').isLength({ min: 1 }).withMessage('Email is required'),
    body('email').isLength({ max: 255 }).withMessage('Email cannot be longer than 255 characters'),
    body('email').matches(/^\S*$/).withMessage('Username cannot contain whitespace'),
    body('email').isEmail().withMessage('Email must be valid'),

    // password
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password').isLength({ max: 50 }).withMessage('Password cannot be longer than 50 characters'),
];

const updateUserValidationRules = [
    // username
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('username').optional().isLength({ max: 20 }).withMessage('Username cannot be longer than 20 characters'),
    body('username').optional().matches(/^\S*$/).withMessage('Username cannot contain whitespace'),

    // email
    body('email').optional().isLength({ max: 255 }).withMessage('Email cannot be longer than 255 characters'),
    body('email').optional().matches(/^\S*$/).withMessage('Username cannot contain whitespace'),
    body('email').optional().isEmail().withMessage('Email must be valid'),

    // password
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password').optional().isLength({ max: 50 }).withMessage('Password cannot be longer than 50 characters'),
];


// Create a new user
router.post('/', createUserValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const { rows } = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        logger.info('New user created:', rows[0].username);
        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error creating user:\n', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, username, email FROM users');
        logger.info('All users retrieved');
        res.json(rows);
    } catch (error) {
        logger.error('Error retrieving users:\n', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }
        logger.info('User retrieved:', rows[0].username);
        res.json(rows[0]);
    } catch (error) {
        logger.error('Error retrieving user:\n', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a user
router.put('/:id', updateUserValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { username, email, password } = req.body;
    const updateField = []
    const queryParams = []
    let queryIndex = 1;

    if (username) {
        updateField.push(`username = $${queryIndex++}`);
        queryParams.push(username);
    }
    if (email) {
        updateField.push(`email = $${queryIndex++}`);
        queryParams.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateField.push(`password = $${queryIndex++}`);
        queryParams.push(hashedPassword);
    }

    if (updateField.length == 0) {
        return res.status(400).send('No fields to update');
    }

    const query = `UPDATE users SET ${updateField.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${queryIndex} RETURNING *`;
    queryParams.push(id);

    try {
        const { rows } = await db.query(query, queryParams);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }
        logger.info('User updated:', rows[0].username);
        res.json(rows[0]);
    } catch (error) {
        logger.error('Error updating user:\n', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        logger.info('User deleted:', id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting user:\n', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

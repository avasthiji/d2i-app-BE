const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUser } = require('../controllers/userController');

// Route to register a new user
router.post('/register', createUser);

// Route to sign in a user
router.post('/login', loginUser);

router.get('/user/:id',getUser);


module.exports = router;
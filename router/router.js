const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');
const AuthController = require('../controllers/AuthController.js');
const auth = require('../middleware/auth.js');
const { body } = require('express-validator');

router.post('/user',UserController.create);
router.get('/users', auth, UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

router.post('/auth/registration',
    body('email').isEmail().withMessage('Укажите валидный email'),
    body('password').isLength({ min: 8, max: 32 }).withMessage('Минимум 8 символов, максимум 32'),
    AuthController.registration
);
router.post('/auth/login', AuthController.login)
router.post('/auth/logout', AuthController.logout)
router.get('/auth/activate/:link', AuthController.activate)
router.get('/auth/refresh', AuthController.refresh)

module.exports = router;

const router = require('express').Router()
const userController = require('../controllers/userController')
const verifyTokenAndAdmin = require('../middlewares/verifyTokenAndAdmin')
const verifyTokenAndAuthenticated = require('../middlewares/verifyAndAuthorized')


router.post('/', userController.addUser) 
router.get('/', verifyTokenAndAdmin ,userController.getAllUsers) 
router.get('/:id', verifyTokenAndAuthenticated ,userController.getYourInfo) 
router.put('/:id', verifyTokenAndAuthenticated ,userController.updateUser) 
router.delete('/:id', verifyTokenAndAdmin ,userController.deleteUser) 
router.get('/logout/:id', verifyTokenAndAuthenticated ,userController.logOut) 

module.exports = router
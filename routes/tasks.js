const router = require('express').Router()
const taskController = require('../controllers/tasksController')
const verifyTokenAndAdmin = require('../middlewares/verifyTokenAndAdmin')
const verifyAndAuthorized = require('../middlewares/verifyAndAuthorized')
const verifyToken = require('../middlewares/verifyToken')

router.post('/' , verifyToken , taskController.addTask)
router.get('/:id' , verifyAndAuthorized , taskController.getYourTasks)
router.put('/:id' , verifyToken , taskController.updateTask)
router.delete('/:id' , verifyToken , taskController.deleteTask)
router.get('/' , verifyTokenAndAdmin , taskController.getAllTasks)

module.exports = router
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()


const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.getAllBook) // Accessible au publique
router.get('/:id', bookCtrl.getOneBook) // Accessible au publique
router.post('/', auth, multer, bookCtrl.createBook) // Route protégée
router.put('/:id', multer, auth, bookCtrl.modifyBook) // Route protégée
router.delete('/:id', auth, bookCtrl.deleteBook) // Route protégée

module.exports = router
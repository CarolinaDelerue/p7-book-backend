const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const bookCtrl = require('../controllers/book')

router.get('/bestrating', bookCtrl.getBestRatings) //meilleurs livres
router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, multer, bookCtrl.createBook)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.rateBook) //noter un livre


module.exports = router

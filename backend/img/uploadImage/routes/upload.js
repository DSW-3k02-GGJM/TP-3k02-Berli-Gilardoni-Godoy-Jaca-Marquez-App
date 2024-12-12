const express = require('express')
require('../../config/passport') 
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const controller = require('../controllers/upload') // importamos el controlador

const router = express.Router()


/**
 * Ruta: /user GET
 */
router.post(
    `/`,
    controller.upload, // llamamos al middleware de multer
    controller.uploadFile
)


module.exports = router
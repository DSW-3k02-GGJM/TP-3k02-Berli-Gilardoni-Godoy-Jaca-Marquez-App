const multer = require('multer')

// configuracion del multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads') // carpeta donde se guardara el archivo
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`) // nombre del archivo
    }
})

const upload = multer({ storage: storage }) // constante para subir archivos que vamos a exportar

exports.upload = upload.single('myFile')

exports.uploadFile = (req, res) => {
    res.send({ data: 'Enviar un archivo' })
}
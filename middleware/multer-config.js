const multer = require('multer') //gestion de fichier uploadé
const sharp = require('sharp') // traitement des images
const path = require('path') // gestion du chemin des images
const fs = require('fs') // pour intéragir avec le Système de Fichier

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/svg': 'svg',
    'image/webp': 'webp'
}

const storage = multer.memoryStorage()

const upload = multer({ storage: storage }).single('image')

module.exports = (req, res, next) => {
    // Utilisation de multer pour gérer l'upload du fichier
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        if (req.file) {
            // Génération du chemin de sortie pour le fichier WebP
            const outputPath = path.join('images', req.file.originalname.split(' ').join('_').split('.')[0] + Date.now() + '.webp')

            try {
                // Utilisation de sharp pour convertir l'image en WebP avec une qualité de 80
                await sharp(req.file.buffer)
                    .webp({ quality: 80 }) // Optimisation de la qualité de l'image WebP //
                    .toFile(outputPath)// Enregistrement de l'image convertie

                // Mise à jour du chemin du fichier et du nom du fichier pour pointer vers le fichier WebP //
                req.file.path = outputPath
                req.file.filename = path.basename(outputPath)
                next()
            } catch (err) {
                return res.status(500).json({ error: err.message })
            }
        } else {
            next()
        }
    })
}
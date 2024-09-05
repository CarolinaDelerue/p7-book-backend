const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).json({ error: 'Non-autorisé' })
        }
        // Extraction du token JWT du header d'autorisation (le token est après "Bearer ")
        const token = authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Non-autorisé' })
        }
        // Vérification et décodage du token JWT en utilisant la clé secrète stockée dans les variables d'environnement
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // Extraction de l'ID utilisateur du token décodé
        const userId = decodedToken.userId
        // Ajout de l'ID utilisateur à l'objet de requête pour une utilisation ultérieure dans les middlewares ou les routes
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error })
    }
}
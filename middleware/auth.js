const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const token = authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId

        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error })
    }
}
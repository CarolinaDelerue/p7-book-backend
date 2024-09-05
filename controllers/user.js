const User = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const { hashPassword, comparePassword } = require('../utils/password.handler')

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Veuillez remplir tous les champs' })
        }

        const isUserAlreadyExist = await User.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé !' })
        }

        const hashPassword = await hashPassword(password)

        const user = new User({
            email,
            password: hashPassword
        })

        await user.save()

        return res.status(201).json({ message: 'Utilisateur créé !' })
    } catch (error) {
        console.error("Error signup", error)
        return res.status(500).json({ error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Veuillez remplir tous les champs' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect !' })
        }

        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect !' })
        }

        const accessToken = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })

        return res.status(200).json({
            userId: user._id,
            token: accessToken
        })
    } catch (error) {
        console.error("Error login", error)
        return res.status(500).json({ error })
    }
}
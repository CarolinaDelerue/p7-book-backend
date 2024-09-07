const User = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const { hashPassword, comparePassword } = require('../utils/password.handler')

// Fonction pour valider l'adresse email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Veuillez remplir tous les champs' })
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Veuillez entrer une adresse email valide.' })
        }

        const isUserAlreadyExist = await User.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé !' })
        }

        const hashedPassword = await hashPassword(password)

        const user = new User({
            email,
            password: hashedPassword // Utilisation de hashedPassword
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

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Veuillez entrer une adresse email valide.' })
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

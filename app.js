const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/user')

const app = express() // Déclarez app ici

// MongoDB Connection
mongoose.connect('mongodb+srv://caro:NbXesmYQaZIWE5H5@cluster0.gvoic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))



// CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Middleware to parse JSON requests
app.use(express.json())

// API Routes
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

// Error Handling Middleware
app.use((error, req, res, next) => {
    console.error(error.message)
    res.status(500).json({ error: error.message })
})

module.exports = app

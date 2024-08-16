const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://caro:NbXesmYQaZIWE5H5@cluster0.gvoic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use((req, res, next) => {
    console.log('Requête reçue !')
    next()
})

app.use((req, res, next) => {
    res.status(201)
    next()
})

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' })
    next()
})

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !')
})

module.exports = app
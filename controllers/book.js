const Book = require('../models/book')
const fs = require('fs')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }))
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete bookObject._userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }))
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => res.status(500).json({ error }))
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

// Notation d'un livre //
exports.rateBook = (req, res, next) => {
    // Crée un nouvel objet de notation en récupérant l'ID de l'utilisateur depuis l'authentification
    // et la note (rating) depuis le corps de la requête.
    const newRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    }

    // Vérification de la validité de la note //
    // Si la note n'est pas comprise entre 0 et 5, renvoie une erreur 400 (Bad Request).
    if (newRating.grade < 0 || newRating.grade > 5) {
        return res.status(400).json({ message: 'La note doit se trouver entre 0 et 5' })
    }

    // Récupération du livre avec l'ID fourni dans les paramètres de la requête (req.params.id).
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Si le livre n'est pas trouvé, renvoie une erreur 404 (Not Found).
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' })
            }

            // Vérification si l'utilisateur a déjà noté ce livre //
            // Si l'utilisateur a déjà noté le livre (en fonction de son userId), renvoie une erreur 400 (Bad Request).
            if (book.ratings.find(r => r.userId === req.auth.userId)) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre' })
            }

            // Ajout de la nouvelle note dans le tableau des notations du livre (ratings).
            book.ratings.push(newRating)

            // Recalcule la moyenne des notes du livre en tenant compte de la nouvelle note ajoutée.
            book.averageRating = (book.averageRating * (book.ratings.length - 1) + newRating.grade) / book.ratings.length

            // Sauvegarde le livre mis à jour dans la base de données et renvoie le livre mis à jour en réponse.
            return book.save()
        })
        .then(updatedBook => res.status(201).json(updatedBook)) // Si tout se passe bien, renvoie le livre mis à jour avec un statut 201 (Created).
        .catch(error => res.status(400).json({ error })) // En cas d'erreur lors de la sauvegarde, renvoie une erreur 400 (Bad Request).
}


// Récupération des 3 meilleures notations //
exports.getBestRatings = (req, res, next) => {
    // Recherche tous les livres dans la base de données.
    Book.find()
        // Trie les livres par la moyenne des notes (averageRating) de manière décroissante (les meilleures notes en premier).
        .sort({ averageRating: -1 })
        // Limite le résultat à 3 livres (les trois meilleures notes).
        .limit(3)
        // Renvoie les trois livres avec les meilleures notes au client avec un statut 200 (OK).
        .then(books => res.status(200).json(books))
        // En cas d'erreur lors de la requête, renvoie une erreur 400 (Bad Request).
        .catch(error => res.status(400).json({ error }))
}
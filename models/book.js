const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
})

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 } // Définir une valeur par défaut
})

const calculateAverageRating = (book) => {
    if (book.ratings.length > 0) {
        const totalGrades = book.ratings.reduce((total, rating) => total + rating.grade, 0)
        return totalGrades / book.ratings.length
    } else {
        return 0 // Pas de notes, moyenne à 0
    }
}

// Middleware "pre('save')" pour mettre à jour la moyenne avant de sauvegarder
bookSchema.pre('save', function (next) {
    this.averageRating = calculateAverageRating(this)
    next()
})

module.exports = mongoose.model('Book', bookSchema)

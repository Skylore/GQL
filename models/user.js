const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        name: String,
        age: Number,
        login: String,
        creationDate: Date,
    },
    {
        collection: 'users'
    }
)

module.exports = mongoose.model('User', userSchema)
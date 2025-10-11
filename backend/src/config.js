const mongoose = require('mongoose')

const connect = mongoose.connect("mongodb://localhost:27017/appDb")

connect.then(() => {
    console.log("Database connected")
})
.catch(() => {
    console.error("Database connection failed")
})

const LoginSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    benefits: {
        type: Array,
        default: []
    }
})

const collection = new mongoose.model("users", LoginSchema)

module.exports = collection 
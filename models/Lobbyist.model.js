const {Schema} = require("mongoose")
const User = require("./User.model")

const lobbyistSchema = new Schema({
    organization: String
}, {timestamps: true})

const Lobbyist = User.discriminator("Lobbyist", lobbyistSchema)

module.exports = Lobbyist
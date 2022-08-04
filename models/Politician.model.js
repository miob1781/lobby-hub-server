const {Schema} = require("mongoose")
const User = require("./User.model")
const keywords = require("../utils/keywords")

const politicianSchema = new Schema({
    areasOfInfluence: {
        type: [String],
        enum: keywords,
        required: true
    },
    party: String,
    position: String
}, {timestamps: true})

const Politician = User.discriminator("Politician", politicianSchema)

module.exports = Politician
const {model, Schema} = require("mongoose")
const keywords = require("../utils/keywords")

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lobbyist: {
        type: Schema.Types.ObjectId,
        ref: "Lobbyist",
        required: true
    },
    areasOfInfluence: {
        type: [String],
        enum: keywords,
        required: true
    },
    politicians: {
        type: [Schema.Types.ObjectId],
        ref: "Politician"
    },
    financialOffer: Number,
    otherOffers: String
}, {timestamps: true})

const Service = model("Service", serviceSchema)

module.exports = Service

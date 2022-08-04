const {model, Schema} = require("mongoose")
const keywords = require("../utils/keywords")

const serviceSchema = new Schema({
    lobbyist: {
        type: Schema.Types.ObjectId,
        ref: "Lobbyist",
        required: true,
        unique: true
    },
    areasOfInfluence: {
        type: [String],
        enum: keywords,
        required: true
    },
    politician: {
        type: Schema.Types.ObjectId,
        ref: "Politician"
    },
    financialOffer: Number,
    otherOffers: String
}, {timestamps: true})

const Service = model("Service", serviceSchema)

module.exports = Service

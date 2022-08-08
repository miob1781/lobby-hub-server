const router = require("express").Router()
const Service = require("../models/Service.model");
const Lobbyist = require("../models/Lobbyist.model");
const Politician = require("../models/Politician.model");

router.get("/lobbyist/:lobbyistId", (req, res, next) => {
    const {lobbyistId} = req.params
    Service.find()
        .populate("politicians")
        .then(services => {
            const servicesByLobbyist = services.filter(service => service.lobbyist._id.toString() === lobbyistId)
            res.status(200).json(servicesByLobbyist)
        })
        .catch(err => {
            console.log("An error has occurred while loading services by lobbyist:", err);
            next(err);
        })
})

router.post("/services-matching-keywords", (req, res, next) => {
    const {areasOfInfluence} = req.body
    Service.find({
        areasOfInfluence: {
            "$in": areasOfInfluence
        }
    })
        .then(services => {
            console.log("..................................", services)
            res.status(200).json(services)
        })
        .catch(err => {
            console.log("An error occurred while loading politicians matching keywords:", err);
            next(err);
        })
})

router.get("/politician/:politicianId", (req, res, next) => {
    const {politicianId} = req.params
    Service.find()
        .populate("lobbyist")
        .then(services => {
            const servicesByPolitician = services.filter(service => {
                if (service.politicians.length === 0) return false
                return service.politicians._id.toString() === politicianId
            })
            res.status(200).json(servicesByPolitician)
        })
        .catch(err => {
            console.log("An error has occurred while loading services by politician:", err);
            next(err);
        })
})

router.post("/politicians", (req, res, next) => {
    const {areasOfInfluence} = req.body
    console.log(areasOfInfluence)
    Politician.find({
        areasOfInfluence: {
            "$in": areasOfInfluence
        }
    })
        .then(politicians => {
            res.status(200).json(politicians)
        })
        .catch(err => {
            console.log("An error occurred while loading politicians matching keywords:", err);
            next(err);
        })
})

router.get("/:serviceId", (req, res, next) => {
    const {serviceId} = req.params
    Service.findById(serviceId)
        .populate("lobbyist")
        .populate("politicians")
        .then(service => {
            res.status(200).json(service)
        })
        .catch(err => {
            console.log("An error has occurred while loading service by id:", err);
            next(err);
        })
})


router.post("/", (req, res, next) => {
    const {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer} = req.body
    const serviceData = {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer}
    Service.create(serviceData)
        .then(createdService => {
            res.status(201).json(createdService)
        })
        .catch(err => {
            console.log("An error has occurred while creating a new service:", err);
            next(err);
        })
})

router.put("/:serviceId", (req, res, next) => {
    const {serviceId} = req.params
    const {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer} = req.body
    const serviceData = {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer}
    Service.findByIdAndUpdate(serviceId, serviceData, {new: true})
        .then(newData => {
            res.status(200).json({newData})
        })
        .catch(err => {
            console.log("An error has occurred while updating a service:", err);
            next(err);
        })
})

router.delete("/:serviceId", (req, res, next) => {
    const {serviceId} = req.params
    Service.findByIdAndDelete(serviceId)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            console.log("An error has occurred while deleting a service:", err);
            next(err);
        })
})

module.exports = router

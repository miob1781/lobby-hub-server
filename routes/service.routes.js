const router = require("express").Router()
const Service = require("../models/Service.model");
const Politician = require("../models/Politician.model");

router.get("/lobbyist/:lobbyistId", (req, res, next) => {
    const { lobbyistId } = req.params
    Service.find()
        .then(services => {
            const servicesByLobbyist = services.filter(service => service.lobbyist.toString() === lobbyistId)
            res.status(200).json(servicesByLobbyist)
        })
        .catch(err => {
            console.log("An error has occurred while loading services by lobbyist:", err);
            next(err);
        })
})

router.get("/politician/:politicianId", (req, res, next) => {
    const { politicianId } = req.params
    Service.find()
        .then(services => {
            const servicesByPolitician = services.filter(service => {
                return service.politicians.find(politician => politician.toString() === politicianId)
            })
            res.status(200).json(servicesByPolitician)
        })
        .catch(err => {
            console.log("An error has occurred while loading services by politician:", err);
            next(err);
        })
})

router.post("/services-matching-keywords", (req, res, next) => {
    const { areasOfInfluence } = req.body
    Service.find({
        areasOfInfluence: {
            "$in": areasOfInfluence
        }
    })
        .then(services => {
            res.status(200).json(services)
        })
        .catch(err => {
            console.log("An error occurred while loading politicians matching keywords:", err);
            next(err);
        })
})

router.post("/politicians", (req, res, next) => {
    const { areasOfInfluence } = req.body
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
    const { serviceId } = req.params
    Service.findById(serviceId)
        .populate(["lobbyist", "politicians"])
        .then(service => {
            res.status(200).json(service)
        })
        .catch(err => {
            console.log("An error has occurred while loading service by id:", err);
            next(err);
        })
})

router.post("/", (req, res, next) => {
    const { title, description, lobbyist, areasOfInfluence, financialOffer, otherOffers } = req.body
    const serviceData = { title, description, lobbyist, areasOfInfluence, financialOffer, otherOffers }
    Service.create(serviceData)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            console.log("An error has occurred while creating a new service:", err);
            next(err);
        })
})

router.put("/:serviceId", (req, res, next) => {
    const { serviceId } = req.params
    const { title, description, lobbyist, areasOfInfluence, politicians, financialOffer, otherOffers } = req.body
    const serviceData = { title, description, lobbyist, areasOfInfluence, politicians, financialOffer, otherOffers }
    Service.findByIdAndUpdate(serviceId, serviceData, { new: true })
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            console.log("An error has occurred while updating a service:", err);
            next(err);
        })
})

router.put("/:serviceId/accept-offer", (req, res, next) => {
    const { serviceId } = req.params
    const { politician } = req.body
    Service.findByIdAndUpdate(serviceId, { $addToSet: { politicians: politician } }, { new: true })
        .populate(["lobbyist", "politicians"])
        .then(updatedService => {
            res.status(200).json(updatedService)
        })
        .catch(err => {
            console.log("An error has occurred while accepting a service:", err);
            next(err);
        })
})

router.delete("/:serviceId", (req, res, next) => {
    const { serviceId } = req.params
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

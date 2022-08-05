const router = require("express").Router()
const Service = require("../models/Service.model");

router.get("/lobbyist/:lobbyistId", (req, res, next) => {
    const {lobbyistId} = req.params
    Service.find()
        .then(services => {
            const servicesByLobbyist = services.filter(service => service.lobbyist._id.toString() === lobbyistId)
            res.json({servicesByLobbyist})
        })
        .catch(err => {
            console.log("An error has occurred loading services by lobbyist:", err);
            next(err);
        })
})

router.get("/politician/:politicianId", (req, res, next) => {
    const {politicianId} = req.params
    Service.find()
        .then(services => {
            const servicesByPolitician = services.filter(service => service.politician._id.toString() === politicianId)
            res.json({servicesByPolitician})
        })
        .catch(err => {
            console.log("An error has occurred loading services by politician:", err);
            next(err);
        })
})

router.get("/:serviceId", (req, res, next) => {
    const {serviceId} = req.params
    Service.findById(serviceId)
        .then(service => {
            res.json({service})
        })
        .catch(err => {
            console.log("An error has occurred loading service by id:", err);
            next(err);
        })
})

router.post("/create", (req, res, next) => {
    const {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer} = req.body
    const serviceData = {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer}
    Service.create(serviceData)
        .catch(err => {
            console.log("An error has occurred while creating a new service:", err);
            next(err);
        })
})

router.put("/:serviceId/edit", (req, res, next) => {
    const {serviceId} = req.params
    const {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer} = req.body
    const serviceData = {lobbyist, areasOfInfluence, politician, financialOffer, otherOffer}
    Service.findByIdAndUpdate(serviceId, serviceData, {new: true})
        .catch(err => {
            console.log("An error has occurred while updating a service:", err);
            next(err);
        })
})

router.delete("/:serviceId/delete", (req, res, next) => {
    const {serviceId} = req.params
    Service.findByIdAndDelete(serviceId)
        .catch(err => {
            console.log("An error has occurred while deleting a service:", err);
            next(err);
        })
})

module.exports = router

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Lobbyist = require("../models/Lobbyist.model");
const Politician = require("../models/Politician.model");

router.get("/loggedin", (req, res) => {
    res.json(req.user);
});

router.post("/signup", (req, res) => {
    const { username, password, email, type } = req.body;

    if (!username) {
        return res
            .status(400)
            .json({ errorMessage: "Please provide your username." });
    }

    if (password.length < 8) {
        return res.status(400).json({
            errorMessage: "Your password needs to be at least 8 characters long.",
        });
    }

    //   ! This use case is using a regular expression to control for special characters and min length
    /*
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  
    if (!regex.test(password)) {
      return res.status(400).json( {
        errorMessage:
          "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }
    */

    // Search the database for a user with the username submitted in the form
    User.findOne({ username }).then((found) => {
        // If the user is found, send the message username is taken
        if (found) {
            return res.status(400).json({ errorMessage: "Username already taken." });
        }

        // if user is not found, create a new user (lobbyist or politician) - start with hashing the password
        return bcrypt
            .genSalt(saltRounds)
            .then((salt) => bcrypt.hash(password, salt))
            .then((hashedPassword) => {
                // Create a user and save it in the database
                if (type === "lobbyist") {
                    const { organization } = req.body
                    return Lobbyist.create({
                        username,
                        password: hashedPassword,
                        email,
                        type,
                        organization
                    })
                        .catch(err => {
                            console.log("An error has occurred while creating a new lobbyist:", err);
                            next(err);
                        })
                } else if (type === "politician") {
                    const { areasOfInfluence, position, party } = req.body
                    return Politician.create({
                        username,
                        password: hashedPassword,
                        email,
                        type,
                        areasOfInfluence,
                        position,
                        party
                    })
                        .catch(err => {
                            console.log("An error has occurred while creating a new politician:", err);
                            next(err);
                        })
                }
            })
            .then((user) => {

                //At this point, we have checked that credentials are correct...
                const { _id, email, username, type, organization, position, party, areasOfInfluence } = user;

                // Create an object that will be set as the token payload
                const payload = { _id, email, username, type, organization, position, party, areasOfInfluence };

                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );
                // Send the token as the response
                return res.status(200).json({ authToken: authToken });
            })
            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError) {
                    return res.status(400).json({ errorMessage: error.message });
                }
                if (error.code === 11000) {
                    return res.status(400).json({
                        errorMessage:
                            "Username need to be unique. The username you chose is already in use.",
                    });
                }
                return res.status(500).json({ errorMessage: error.message });
            });
    });
});

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
        return res
            .status(400)
            .json({ errorMessage: "Please provide your username." });
    }

    // Here we use the same logic as above
    // - either length based parameters or we check the strength of a password
    if (password.length < 8) {
        return res.status(400).json({
            errorMessage: "Your password needs to be at least 8 characters long.",
        });
    }

    // Search the database for a user with the username submitted in the form
    User.findOne({ username })
        .then((user) => {
            // If the user isn't found, send the message that user provided wrong credentials
            if (!user) {
                return res.status(400).json({ errorMessage: "Wrong credentials." });
            }

            // If user is found based on the username, check if the in putted password matches the one saved in the database
            bcrypt.compare(password, user.password).then((isSamePassword) => {
                if (!isSamePassword) {
                    return res.status(400).json({ errorMessage: "Wrong credentials." });
                }

                //At this point, we have checked that credentials are correct...
                const { _id, email, username, type, organization, position, party, areasOfInfluence } = user;

                // Create an object that will be set as the token payload
                const payload = { _id, email, username, type, organization, position, party, areasOfInfluence };

                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );

                // Send the token as the response
                return res.status(200).json({ authToken: authToken });
            });
        })
        .catch((err) => {
            // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
            // you can just as easily run the res.status that is commented out below
            next(err);
            // return res.status(500).render("login", { errorMessage: err.message });
        });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
    res.json(req.payload);
});

router.put("/user/:id", (req, res) => {
    const { id } = req.params;
    const { username, password, email, type } = req.body;

    if (!username) {
        return res
            .status(400)
            .json({ errorMessage: "Please provide your username." });
    }

    if (password.length < 8) {
        return res.status(400).json({
            errorMessage: "Your password needs to be at least 8 characters long.",
        });
    }

    //   ! This use case is using a regular expression to control for special characters and min length
    /*
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  
    if (!regex.test(password)) {
      return res.status(400).json( {
        errorMessage:
          "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }
    */

    bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
            // Create a user and save it in the database
            if (type === "lobbyist") {
                const { organization } = req.body
                return Lobbyist.findByIdAndUpdate(id, {
                    username,
                    password: hashedPassword,
                    email,
                    type,
                    organization
                }, { new: true }).catch(err => {
                    console.log("An error has occurred while creating a new lobbyist:", err);
                    next(err);
                })
            } else if (type === "politician") {
                const { areasOfInfluence, position, party } = req.body
                return Politician.findByIdAndUpdate(id, {
                    username,
                    password: hashedPassword,
                    email,
                    type,
                    areasOfInfluence,
                    position,
                    party
                }, { new: true }).catch(err => {
                    console.log("An error has occurred while creating a new politician:", err);
                    next(err);
                })
            }
        })
        .then((user) => {
            // Bind the user to the session object
            res.status(201).json(user);
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({ errorMessage: error.message });
            }
            return res.status(500).json({ errorMessage: error.message });
        });
});

router.delete("/user/:id", (req, res, next) => {
    const { id } = req.params
    User.findByIdAndDelete(id)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            console.log("An error has occurred while deleting a user:", err);
            next(err);
        })
})

module.exports = router;

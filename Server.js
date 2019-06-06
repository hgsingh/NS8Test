//import express from 'express'
//import mongoose from 'mongoose'
//import bodyParser from 'body-parser'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
//accepts only json requests
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const userSchema = new  mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: String,
})

const eventSchema = new mongoose.Schema({
    event: String,
    time: Number,
    user: String
})
const User = mongoose.model('User', userSchema)
const Event = mongoose.model('Event', eventSchema)


userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
        email: login
    });
    return user;
}

eventSchema.statics.findAllBy = async function (userName) {
    let events = await this.find({
        user: userName
    }
    )
    return events
}

const connectDb = () => {
    return mongoose.connect('mongodb://localhost:27017/testdb')
};

// var AUTH_VALUE = "hgsingh:1d6fca2ff31391139be4952c61a3b0468e20f186";
// var AUTH_HEADER = "Authorization";
// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Authorization");
//     res.header("Access-Control-Allow-Methods", "GET");
//     res.header("Access-Control-Allow-Methods", "POST");
//     next();
// });
app.post('/', function (req, res) {
    let user = req.body
    if (!validateEmail(String(user.email)) ||
        !validatePassword(String(user.password)) ||
        !validatePhoneNumber(String(user.phone))) {
        return res.status(400).send({
            success: 'false',
            message: 'send a valid requests',
        });
    } else {
        User.find({ email: user.email }, function (err, current_user) {
            console.log(current_user)
            if (current_user.length == 0) {
                //push the user and send back json
                let newUser = new User({
                    email: user.email,
                    password: user.password,
                    phone: user.phone
                })
                newUser.save()
                res.status(200).send({
                    type: "CREATED"
                })
            } else {
                console.log(String(user.password) +String(current_user.password) )
                if (String(user.password) === String(current_user.password)) {
                    let newEvent = new Event({
                        event: "LOGIN",
                        time: Date.now(),
                        user: current_user.email
                    })
                    newEvent.save()
                    res.status(200).send({
                        type: "LOGIN"
                    })
                } else {
                    res.status(401).send({
                        success: 'false',
                        message: 'wrong password',
                    })
                }
            }
        })

    }
})

app.get('api/{user}', (req, res) => {
    foundUser = userSchema.statics.findByLogin(req.params.user)
    if (found == undefined) {
        return res.status(404).send({
            success: 'false',
            message: 'no such user',
        })
    } else {
        events = eventSchema.statics.findAllBy(foundUser)
        return res.status(200).send(
            { events }
        )
    }
})

app.get('/', function (req, res) {
    Event.find({}, function (err, events) {
        var eventMap = {}

        events.forEach(function (event) {
            eventMap[event._id] = user
        })

        res.send(eventMap)
    })
})

connectDb().then(async () => {
    app.listen(PORT, () =>
        console.log(`User app listening on port ${PORT}!`),
    )
})

function validateEmail(email) {
    console.log(email)
    if (email == undefined) return false
    let re = /\S+@\S+\.\S+/
    return re.test(String(email).toLowerCase())
}

function validatePhoneNumber(phone) {
    var re = /^[0-9]{3}[-\s][0-9]{3}[-\s][0-9]{4}$/
    return phone === undefined
        || String(phone) === ''
        || re.test(String(phone).toLowerCase())
}
function validatePassword(password) {
    return password !== undefined && String(password) !== ''
}

const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
    register: async (req, res) => {
        try {
            const isUserExists = await userModel.findOne({ sEmail: req.body.sEmail })
            if (isUserExists) return res.status(401).json({ message: 'User with this email already exists' })
            const data = await userModel.create(req.body)
            setToken(res, data, 'User Registered Successfully')
        } catch (error) {
            console.log("error: ", error)
            return res.status(500).json({ message: 'Something went wrong!' })
        }
    },
    login: async (req, res) => {
        try {
            const data = await userModel.findOne({ sEmail: req.body.sEmail })
            if (!data) {
                return res.status(401).json({ message: 'Invalid Username' })
            }
            const isPassword = bcrypt.compareSync(req.body.sPassword, data.sPassword)
            if (!isPassword) {
                return res.status(401).json({ message: 'Invalid Password' })
            }
            setToken(res, data, 'User Loggedin Successfully')
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong!' })
        }
    },
    profile: async (req, res) => {
        return res.status(200).json({ message: 'Profile Data get successfully', data: req.user })
    },
    authenticateUser: async (req, res, next) => {
        const token = req.headers['authorization']
        if (!token) return res.status(401).json({ message: 'No Token Found' })

        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Invalid Auth Token' })
            const sEmail = decoded.sEmail
            const user = await userModel.findOne({ sEmail: sEmail }, { sPassword: 0 })
            req.user = user
            next()
        })
    }
}

const setToken = (res, user, message) => {
    const token = jwt.sign({ sEmail: user.sEmail }, config.secret, { expiresIn: 86400 })
    const { sPassword, ...rest } = user.toJSON()
    res.status(200).json({ message, data: rest, token })
}
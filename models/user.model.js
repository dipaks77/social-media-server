const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)


const User = new Schema({
    sName: { type: String },
    sEmail: { type: String },
    sPassword: { type: String },
    sFriendsList: { type: Array, default: [] },
    pendingRequests: { type: Array, default: [] },
    requestSent: { type: Array, default: [] }
})

User.pre('save', function (next) {
    const _self = this
    if (_self.isModified('sPassword')) {
        _self.sPassword = bcrypt.hashSync(_self.sPassword, salt)
    }
    next()
})

module.exports = mongoose.model('user', User)

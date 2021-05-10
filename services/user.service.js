const userModel = require('../models/user.model')
const ObjectId = require('mongodb').ObjectID

module.exports = {
    getSuggestionList: async (req, res) => {
        try {
            const friendsList = [...req.user.sFriendsList, ...req.user.requestSent, req.user._id]
            const limit = 2
            const { start } = req.body
            const data = await userModel.find({ _id: { $nin: friendsList } }).select({ 'sName': 1, '_id': 1 }).skip(start).limit(limit).sort({ _id: -1 }).exec()
            if (data && data.length) return res.status(200).json({ message: 'User Suggestion list get success', data, hasMore: true })
            await user.save()
            return res.status(200).json({ message: 'No Users found!', hasMore: false })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    },
    sendFriendRequest: async (req, res) => {
        try {
            const { userId } = req.body
            const user = await userModel.findOne({ _id: userId })
            if (!user) return res.status(401).json({ message: 'User not found!' })
            user.pendingRequests = [...user.pendingRequests, req.user._id]
            req.user.requestSent = [...req.user.requestSent, ObjectId(userId)]
            await user.save()
            await req.user.save()
            res.status(200).json({ message: 'Added as friend' })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    },
    acceptRequest: async (req, res) => {
        try {

            const { userId } = req.body
            const pendingReqIndex = req.user.pendingRequests.indexOf(userId)
            if (pendingReqIndex >= 0) req.user.pendingRequests.splice(pendingReqIndex, 1)

            req.user.sFriendsList = [...req.user.sFriendsList, ObjectId(userId)]
            await req.user.save()

            const user = await userModel.findOne({ _id: userId })
            const sentReqIndex = user.requestSent.indexOf(req.user._id.toString())
            if (sentReqIndex >= 0) user.requestSent.splice(sentReqIndex, 1)
            user.sFriendsList = [...user.sFriendsList, ObjectId(req.user._id)]
            await user.save()
            res.status(200).json({ message: 'Request accepted' })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    },
    rejectRequest: async (req, res) => {
        try {
            const { userId } = req.body
            const pendingReqIndex = req.user.pendingRequests.indexOf(userId)
            if (pendingReqIndex >= 0) req.user.pendingRequests.splice(pendingReqIndex, 1)
            await req.user.save()
            const user = await userModel.findOne({ _id: userId })
            const sentReqIndex = user.requestSent.indexOf(req.user._id.toString())
            if (sentReqIndex >= 0) user.requestSent.splice(sentReqIndex, 1)
            await user.save()
            res.status(200).json({ message: 'Request rejected!' })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    },
    getMyFriendsList: async (req, res) => {
        try {
            const friendsList = req.user.sFriendsList
            const data = await userModel.find({ _id: { $in: friendsList } }).select({ 'sName': 1, '_id': 1 }).exec()
            if (data && data.length) return res.status(200).json({ message: 'Pending request list get success', data, hasMore: true })
            return res.status(200).json({ message: 'No Users found!', hasMore: false })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    },
    getPendingRequests: async (req, res) => {
        try {
            const friendsList = req.user.pendingRequests
            const data = await userModel.find({ _id: { $in: friendsList } }).select({ 'sName': 1, '_id': 1 }).exec()
            if (data && data.length) return res.status(200).json({ message: 'Pending request list get success', data, hasMore: true })
            return res.status(200).json({ message: 'No Users found!', hasMore: false })
        } catch (error) {
            console.log("Error: ", error)
            return res.status(500).json({ message: 'Something went wrong' })
        }
    }
}

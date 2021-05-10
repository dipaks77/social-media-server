const router = require('express').Router()
const authService = require('../services/auth.service')
const userService = require('../services/user.service')

// 
router.post('/', authService.register)
router.post('/login', authService.login)
router.get('/profile', authService.authenticateUser, authService.profile)

// 
router.post('/get-suggestion-list', authService.authenticateUser, userService.getSuggestionList)
router.post('/send-friend-request', authService.authenticateUser, userService.sendFriendRequest)
router.post('/get-pending-requests', authService.authenticateUser, userService.getPendingRequests)
router.post('/get-friends-list', authService.authenticateUser, userService.getMyFriendsList)
router.post('/accept-friend-request', authService.authenticateUser, userService.acceptRequest)
router.post('/reject-friend-request', authService.authenticateUser, userService.rejectRequest)

module.exports = router
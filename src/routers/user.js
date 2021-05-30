const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body) 

    try {
        await user.save()

        //generate token for newly created user
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send(e)

    }
    
})

//login router
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //generate token
        const token  = await user.generateAuthToken()
        if (!user) {
            res.status(404).send('User not Found :(')
        }
        
        //console.log(user)
        res.send({ user, token })

    } catch (error) {
        res.status(404).send({ error: 'Unable to Login :(' })
    }
})

//logout router
//logout user from only a device
router.post('/users/logout', auth, async (req, res) => {
    try {
        //return false
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send('Logged Out Successfully :)')

    } catch (e) {
        res.status(500).send()
    }
})

//logout router
//logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send('All devices logged Out')

    } catch (e) {
        res.status(500).send()
    }
})

//route to fetch all users
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})


///Update user
router.patch('/users/me', auth, async (req, res) => {
    //Ensuring only available fields are being updated, else throw a 404 error
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Update'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)

    } catch (e) {
        res.status(400).send()
    }
})

//Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})




module.exports = router
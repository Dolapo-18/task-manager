const express = require('express')
const router = new express.Router()

const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body) 

    try {
        await user.save()
        res.status(201).send(user)

    } catch (e) {
        res.status(400).send(e)

    }
    
})

//login router
router.post('/users/login', (req, res) => {
    try {
        const user = User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            res.status(404).send('User not Found :(')
        }
        //console.log(user)
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }
})

//route to fetch all users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200).send(users)

    } catch (e) {
        res.status(500).send(e)

    }

})

//route to fetch only a user by ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('User not found :(')
        }

        res.status(200).send(user)

    } catch (e) {
        res.status(500).send('Server Error!!!')
    }

})

///Update user
router.patch('/users/:id', async (req, res) => {
    //Ensuring only available fields are being updated, else throw a 404 error
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Update'})
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        if (!user) {
            res.status(404).send()

        }
        res.status(200).send(user)

    } catch (e) {
        res.status(400).send()
    }
})

//Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send({ error: 'User not found'})

        }
        res.status(200).send(user)

    } catch (e) {
        res.status(500).send(e)
    }
})




module.exports = router
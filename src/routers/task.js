const express = require('express')
const router = new express.Router()


const Task = require('../models/task')
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

//route to read all tasks
//tasks?completed=true  //filtering tasks
//tasks?limit=10&skip=0  //pagination
//tasks?sortBy=createdBy:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({ owner: req.user._id }) OR
        //using the populate function to retrieve tasks
        await req.user.populate({
            path: 'mytasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.status(200).send(req.user.mytasks)

    } catch (e) {
        res.status(500).send(e)

    }
    
})

//route to read only a task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Task not found :(')

        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send('Server Error')
    }

})


//update Tasks
router.patch('/tasks/:id', auth, async (req, res) => {
 //Ensuring only available fields are being updated, else throw a 404 error
 const updates = Object.keys(req.body)
 const allowedUpdates = ['description', 'completed']
 const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


 if (!isValidOperation) {
     return res.status(400).send({error: 'Invalid Update'})
 }   

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, isValidOperation: true})
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        
        if (!task) {
            res.status(404).send({ error: 'Task not found'})

        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})


//Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            res.status(404).send({ error: 'Task not Found :('})

        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
const express = require('express')
const router = new express.Router()

const Task = require('../models/task')


router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

//route to read all tasks
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        if (!tasks) {
            res.status(404).send('Tasks not found :(')

        }
        res.status(200).send(tasks)

    } catch (e) {
        res.status(500).send(e)

    }
    
})

//route to read only a task by ID
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send('Task not found :(')

        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send('Server Error')
    }

})


//update Tasks
router.patch('/tasks/:id', async (req, res) => {
 //Ensuring only available fields are being updated, else throw a 404 error
 const updates = Object.keys(req.body)
 const allowedUpdates = ['description', 'completed']
 const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


 if (!isValidOperation) {
     return res.status(400).send({error: 'Invalid Update'})
 }   

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, isValidOperation: true})
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        if (!task) {
            res.status(404).send()

        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})


//Delete Task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send({ error: 'Task not Found :('})

        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
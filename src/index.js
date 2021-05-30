const express = require('express')
require('./db/mongoose')


//user router
const userRouter = require('./routers/user')
//task router
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000




//configure express to parse incoming json
app.use(express.json())

//register our router with app
app.use(userRouter)

//register our router
app.use(taskRouter)




app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('60adffef206d8c0e51e24e70')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('60adffdc206d8c0e51e24e6e')
    await user.populate('mytasks').execPopulate()
    console.log(user.mytasks)
}

//main()
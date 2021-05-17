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


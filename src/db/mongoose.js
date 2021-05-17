//connecting to the DB, run  /Users/dolapo/mongodb/bin/mongod --dbpath=/Users/dolapo/mongodb-data
const mongoose = require('mongoose')



mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})





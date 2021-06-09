//connecting to the DB, run  /Users/dolapo/mongodb/bin/mongod --dbpath=/Users/dolapo/mongodb-data
const mongoose = require('mongoose')



mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})





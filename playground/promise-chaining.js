require('../src/db/mongoose')

const User = require('../src/models/user')

// User.findByIdAndUpdate('609adaac224bef0b0ab2352a', {age: 1}).then((user) => {
//     return User.countDocuments({age: 1})

// }).then((result) => {
//     console.log(result)

// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('609a6703d7eec404e34323fd', 2).then((count) => {
    console.log(count)

}).catch((e) => {
    console.log(e)
})

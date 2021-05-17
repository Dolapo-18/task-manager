require('../src/db/mongoose')

const Task = require('../src/models/task')

// Task.findByIdAndDelete('609cd7299cfd490335ba026b').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })

// }).then((result) => {
//     console.log(result)

// }).catch((e) => {
//     console.log(e)
// })


const deleteTaskAndCount = async (id) => {
    const user = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})

    return count
}

deleteTaskAndCount('609cd4d26bdd6203124e11d4').then((count) => {
    console.log(count)

}).catch((e) => {
    console.log(e)
})
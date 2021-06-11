//Question to type on Udemy to see how to hook the back end to a front end
//Adam Hartleb
//How do I hook up the task-manager API's authentication to a frontend?

const express = require("express");
require("./db/mongoose");

//user router
const userRouter = require("./routers/user");
//task router
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

//configure express to parse incoming json
app.use(express.json());

//register our router with app
app.use(userRouter);

//register our router
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const Student = require('./models/Student');

const isNullOrUndefined = (val) => {
    return val === null || val === undefined || val === "";
}

const app = express();

// middleware 
app.use(express.json());

// Routes

// Get all the students
app.get('/students', async (req, res) => {
    res.send(await Student.find({"isDeleted": false}));
})

// Add student to database
app.post('/students', async (req, res) => {
    // write your codes here
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.send(req.body);
})

// Get specific student
app.get('/students/:id', async (req, res) => {
    // write your codes here
    const id = req.params.id;

    const ans = await Student.findOne({"_id": id, "isDeleted": false});
    if(ans === null) {
        res.sendStatus(404);
    }
    res.send(ans);

})

// delete specific student
app.delete('/students/:id', async (req, res) => {
    // write your codes here
    let type = req.query.type;
    const id = req.params.id;

    if (isNullOrUndefined(id)) {
        res.sendStatus(404);
    }
    if (isNullOrUndefined(type)) {
        type = "hard";
    }

    if (type === "soft") {
        await Student.updateOne({"_id": id}, {"isDeleted": true});
    } else {
        await Student.deleteOne({"_id": id})
    }
    res.sendStatus(200);

})


module.exports = app;

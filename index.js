// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public folder

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to MongoDB Atlas (replace <name> and <password> with your actual credentials)
mongoose.connect("mongodb+srv://<name>:<password>@cluster0.38u1b.mongodb.net/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Database connection error:', err));

// Defining the schema or structure of a single item in MongoDB
const taskSchema = {
    name: {
        type: String,
        required: true
    }
};

// Create a model for the 'tasks' collection using the taskSchema
const Task = mongoose.model("Task", taskSchema);

// Define routes
// GET request to fetch tasks
app.get('/', (req, res) => {
    Task.find({}, (err, tasks) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { tasks: tasks }); // Pass tasks to the EJS template
        }
    });
});

// POST request to add a new task
app.post('/', (req, res) => {
    const newTask = new Task({
        name: req.body.newTask, // Assuming a form field named 'newTask'
    });

    newTask.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/'); // Redirect to GET route after adding task
        }
    });
});

// Define the server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// index.js

app.post("/", function (req, res) {
    const taskName = req.body.newTask;
    if (taskName) {
        const task = new Task({
            name: taskName,
        });

        // Save the task using save method provided 
        // by mongoose. It returns a promise, in 
        // which we re-direct to home page. we write
        // it in then block to make sure that 
        // we are redirected only when the save
        // method finished executing without any 
        // error. Otherwise the item will be saved,
        // after we were redirected, thus, it will look
        // like the task was not added and thus we
        // will have to reload to see the newly added
        // task. Which can be exhausting.
        task.save()
            .then(() => {
                res.redirect("/");
            });
    } else {
        res.redirect("/");
    }
});

// index.js

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Task.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  });



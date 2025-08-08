require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const app = express()
const user_routes = require('./routes/user_routes')
const project_routes = require('./routes/project_routes')
const task_routes = require('./routes/task_routes')
const review_routes = require('./routes/review_routes')
const authMiddleware = require('./middleware/authMiddleware')

//middleware
app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next)=> {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        query: req.query,
        body: req.body
    })
    next()
})

//routes
app.use('/api/users', user_routes)
app.use('/api/projects', authMiddleware, project_routes)
app.use('/api/tasks', authMiddleware, task_routes)
app.use('/api/reviews', authMiddleware, review_routes)

//connect to DB
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server running on ${process.env.PORT}`)
    }) 
})
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const MongDB = require('./database')
require('dotenv').config()
const port = process.env.Backend_port || 8000
const frontend_url = process.env.Frontend_url


const UserRoute = require('./routes/UserRoute')
const RoomRoute = require('./routes/RoomRoute')
const TenantRentRoute = require('./routes/TenantRentRoute')



app.use(express.json())
MongDB();
const allowedOrigins = [
    frontend_url,
    'http://localhost:3000',
];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'refreshtoken'],
}))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send(`Backend is running in port ${port}`)
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})


app.use('/api', UserRoute)
app.use('/api', RoomRoute)
app.use('/api', TenantRentRoute)
const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// const AuthRoutes = require('./src/routes/auth.routes')

const HandleErrorMessage = require('./src/middleware/validatorMessage')
const dbConnection = require('./src/config/dbConfig')
const { publicRoutes } = require('./src/routes/indexRoutes')
// const { checkUserRole } = require('./src/middleware/checkUserRole')


const app = express()

app.use(cors());
app.use(express.json())
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Alllow-Origin", "*")
    res.setHeader(
        "Acccess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
})
app.use('/v1/public', publicRoutes)
// app.use('/api/admin', checkUserRole(Roles.ADMIN))
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.status(200).json({status:"Success", message:"Server Started Successfully"})
})
app.use(HandleErrorMessage)
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
})
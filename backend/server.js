const app = require('./app')
const mongoose = require('mongoose')

const dbConnection = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB');
} 

app.listen(process.env.PORT, () => {
    dbConnection()
    console.log(`Server is running on port ${process.env.PORT}`)
});
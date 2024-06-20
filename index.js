import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/database/db.js'
import airbnbRouter from './src/routes/airbnb.routes.js'
dotenv.config({ path: '.env' })

const app = express()
const port = process.env.PORT

// datatbase connection
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1', airbnbRouter)

app.listen(port, () => {
	console.log('Server is running on port 3000')
})

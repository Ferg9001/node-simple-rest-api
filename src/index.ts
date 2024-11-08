import express from 'express'
import { PORT } from './config'
import morgan from 'morgan'
import usersRoutes from './routes/users.routes'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(usersRoutes)

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
})
const express = require('express')
const cors = require('cors')

const app = express()

//config json response
app.use(express.json())

//solve cors: origin deve receber a url do front
app.use(cors({ credentials: true, origin: 'http://localhost:5000'}))

//public folder for images
app.use(express.static('public'))

//routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

const EmployeeRoutes = require('./routes/EmployeeRoutes')
app.use('/employees', EmployeeRoutes)

const EmployeeHealthExaminationRoutes = require('./routes/EmployeeHealthExaminationRoutes')
app.use('/employee-health-examinations', EmployeeHealthExaminationRoutes)

const ActivityRoutes = require('./routes/ActivityRoutes')
app.use('/activities', ActivityRoutes)

const ActivityRequiredTrainingRoutes = require('./routes/ActivityRequiredTrainingRoutes')
app.use('/activity-required-trainings', ActivityRequiredTrainingRoutes)

const HealthExaminationRoutes = require('./routes/HealthExaminationRoutes')
app.use('/health-examinations', HealthExaminationRoutes)

const TaskRoutes = require('./routes/TaskRoutes')
app.use('/tasks', TaskRoutes)

const TrainingReceivedRoutes = require('./routes/TrainingReceivedRoutes')
app.use('/training-received', TrainingReceivedRoutes)

const TrainingRoutes = require('./routes/TrainingRoutes')
app.use('/trainings', TrainingRoutes)


app.listen(5000)
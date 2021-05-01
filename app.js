const express = require('express')
const app = express()
const API = require('./api/index')

const PORT = 3000

app.use(express.json())

app.get('/api/session', API.login)
app.get('/api/account', API.account)
app.get('/api/marksByTrim/:trim', API.marksByTrim)
app.get('/api/teachers', API.teachers)
app.get('/api/sessionMarks', API.sessionMarks)
app.get('/api/schedule', API.schedule)
app.get('/api/scheduleByWeek/:week', API.scheduleByWeek)

app.listen(PORT, () => 
    console.log(`Server started on ${PORT} port...`)
)
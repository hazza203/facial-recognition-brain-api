// npm install bcrypt-nodejs
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'harry',
		password: 'test',
		database: 'smart-brain'
	}
})

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {res.send('We are working')})

//Post call which validates and signs in a user
app.post('/signin', signin.handleSignIn(db, bcrypt))

//Post call which registers a new user
app.post('/register', register.handleRegister(db, bcrypt))

//Get the profile of the user by id
app.get('/profile/:id', profile.handleProfileGet(db))

//Put call which increments the users image count and returns their current count
app.put('/image', image.handleImage(db))

//Post call which makes the clarifai api request, separating it from front end visability
app.post('/imageUrl', image.handleApiCall)

//Initial function on run
app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})

const Clarifai = require('clarifai')

//Set API key through heroku env variable or your own system variables
const app = new Clarifai.App({
 apiKey: process.env.CLARIFAI_API
});

//Makes the call to Clarifai API and responds with Clarifais response
//This add's an extra layer of security so our apiKey is not visable
const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data)
	}).catch(err => res.status(400).json('Unable to work with api'))
}

//Increment users entries count
//This gets called on the front end once a face has been matched 
const handleImage = (db) => (req, res) => {
	const { id } = req.body
	db('users').where({id: id}).increment('entries', 1).returning('entries').then(entries => {
		res.json(entries[0])
	}).catch(err => res.status(400).json('Failed to update'))
}

module.exports = {
	handleImage,
	handleApiCall
}
//Searches db for the user by ID and returns the user
const handleProfileGet = (db) => (req, res) => {
	const { id } = req.params
	db('users').where({id}).then(user => {
		if(user === undefined || user.length === 0){
			res.status(400).json('User not found')
		} else {
			res.json(user[0])
		}	
	})
}

module.exports = {
	handleProfileGet
}
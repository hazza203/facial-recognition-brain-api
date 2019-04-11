const handleSignIn = (db, bcrypt) => (req, res) => {	
	const {email, password} = req.body
	//Server side validation
	if(!email || !req.body.password){
		return res.status(400).json('Invalid submission')
	}
	let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
  // true means invalid, so our conditions got reversed

  if(email.length === 0 || !email.includes('@') || !email.includes('.', email.indexOf('@')) ||
    password.length < 8 || !strongRegex.test(password)){
  	return res.status(400).json('Invalid submission')
  }

  //Search for email that user has entered in login table
	db('login').where({ email: email})
	.then(data => {
		//Once found compare the hash of the password string received
		//with the hash stored in our db
		//If successful return the user, otherwise return invalid login
		bcrypt.compare(password, data[0].hash, function(err, result) {
				if(result){
					return db('users').where({email: data[0].email})
					.then(user => res.json(user[0]))
					.catch(err => res.status(400).json('invalid login	'))
				} else {
					res.status(400).json('invalid login')
				}
			})
	}).catch(err => res.status(400).json('invalid login	'))
}

module.exports = {
	handleSignIn
}

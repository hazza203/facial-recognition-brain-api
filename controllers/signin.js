const handleSignIn = (db, bcrypt) => (req, res) => {	
	const {email, password} = req.body
	//Validation of data received
	if(!email || !req.body.password){
		return res.status(400).json('Invalid submission')
	}
	let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
  // true means invalid, so our conditions got reversed

  if(email.length === 0 || !email.includes('@') || !email.includes('.', email.indexOf('@')) ||
    password.length < 8 || !strongRegex.test(password)){
  	return res.status(400).json('Invalid submission')
  }
	db('login').where({ email: email})
	.then(data => {
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

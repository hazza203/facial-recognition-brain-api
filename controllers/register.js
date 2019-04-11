const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, name, password} = req.body
	//Server side validation
	if(!email || !password || !name){
		return res.status(400).json('Invalid submission')
	}
	let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
  // true means invalid, so our conditions got reversed

  if(email.length === 0 || !email.includes('@') || !email.includes('.', email.indexOf('@')) ||
    password.length < 8 || !strongRegex.test(password)){
  	return res.status(400).json('Invalid submission')
  }

  //Hash the password
	bcrypt.hash(password, null, null, function(err, hash) {
		//Create db transations
		db.transaction(trx => {
			trx.insert({
				name: name,
				email: email,
				joined: new Date()
				
			})
			//First into users table
			.into('users')
			.returning('*')
			//then into login table (foreign key email references users(email))
			//insert hash here, not password string
			.then(user => {
				return trx('login')
				.returning('*')
				.insert({
					hash: hash,
					email: email
				})
				.then(res.json(user[0]))
			})
			// Commit trx and rollback if fails
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register'))
	})
}

module.exports = {
	handleRegister
}
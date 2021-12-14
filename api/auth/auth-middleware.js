const User = require('../users/users-model');
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
 function restricted(req,res,next) {
  next()
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree (req,res,next) {
  try{
    const user = await User.findBy({username: req.body.username}).first()
    if(user) { 
      next({message: "Username taken", status:422})
    }else {
      next()
    }
  }catch (err) {
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req,res,next) {
  const validUsername = await User.findBy({username: req.body.username }).first()

  if (!validUsername) {
    next({status:401, message:"Invalid credentials"})
  }else{
    req.user = validUsername;
    next()
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req,res,next) {
  if(!req.body.password || req.body.password.length < 3){
    next({message: "Password must be longer than 3 chars", status:422 })
  }else {
    next()
  }

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
checkUsernameFree,
checkUsernameExists,
checkPasswordLength,
}
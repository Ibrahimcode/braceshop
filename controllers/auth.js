 const bcrypt = require('bcryptjs')
 const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  
//   console.log(req.get('cookie').split(';')[2])
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isLoggedIn: req.session.isLoggedIn
      
    });

  
};


exports.postLogin = (req, res, next) => {
  
//   res.setHeader('Set-Cookie', 'isLoggedIn=true')

    const email = req.body.email
    const password = req.body.password

  User.findOne({email:email})
    .then(user => {
        if(!user){
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user
                return req.session.save(err => {
                    console.log(err)
                    res.redirect('/')
                })
            }
            console.log('Invalid Credential')
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
            res.redirect('/login')
        })
        
    }).catch(err => {
        console.log('user not found.')
        console.log(err)
    })

};

exports.postLogout = (req, res, next) =>{

    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign UP',
        isLoggedIn: false
    })
}

exports.postSignUp = (req, res, next) => {
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    // check whether the email exist
    User.findOne({email: email})
    .then(UserDoc => {
        if(UserDoc){
            console.log(`User with ${email} already exixt`)
            return res.redirect('/signup')
        }
        return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                fname: fname,
                lname: lname,
                email: email,
                password: hashedPassword,
                cart: {items: []}
            })
            return user.save()

        })
        .then(result => {
            console.log('New user added')
            return res.redirect('/login')
        })
    }).catch(err => {
        console.log(err)
    })
}
  

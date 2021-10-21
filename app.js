const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDbSesion = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const cors = require('cors') // Place this with other requires (like 'path' and 'express')


const errorController = require('./controllers/error');
const User = require('./models/user')

const MONGODB_URI = "mongodb+srv://Ibrahim:1234@cluster0.yai94.mongodb.net/braceshop?retryWrites=true&w=majority"

const app = express();
const sessionStore = mongoDbSesion({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf()


const PORT = process.env.PORT || 3002; // So we can run on heroku || (OR) localhost:5000

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// const options = {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     family: 4
// };

const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;

// mongodb connection
// mongodb+srv://Ibrahim:<password>@cluster0.yai94.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// mongodb compass
// mongodb+srv://Ibrahim:<password>@cluster0.yai94.mongodb.net/test

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: sessionStore}))
app.use(csrfProtection)

app.use((req, res, next) =>{
    // '6167aba7bbe7409198de44aa')
    if (!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user
        next()
    }).catch(err => {
        console.log('user not found.')
        console.log(err)
    })
})

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

// app.listen(3000);

mongoose.connect(MONGODB_URL).then(result => {

    User.findOne()
    .then(user => {
        if(!user){

        const user = new User({
            name: 'Ibram',
            email: 'ibram@test.com',
            cart:{items: []}
        })

        user.save()
        }
    })

    app.listen(PORT,  () => console.log(`Listening on ${PORT}`))
    
}).catch(err => {
    console.log("Database connection failed!")
    console.log(err)
})
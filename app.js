const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');

const app = express();

const PORT = process.env.PORT || 3002; // So we can run on heroku || (OR) localhost:5000

// mongodb connection
// mongodb+srv://Ibrahim:<password>@cluster0.yai94.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// mongodb compass
// mongodb+srv://Ibrahim:<password>@cluster0.yai94.mongodb.net/test

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// app.listen(3000);

mongoose.connect('mongodb+srv://Ibrahim:1234@cluster0.yai94.mongodb.net/braceshop?retryWrites=true&w=majority').then(result => {
    app.listen(PORT,  () => console.log(`Listening on ${PORT}`))
    
}).catch(err => {
    console.log("Database connection failed!")
    console.log(err)
})
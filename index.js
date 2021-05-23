const express = require('express');
const app = express();
const router = express.Router();
const {centralAuth} = require('./core/middlewares/centralAuth');
const mongoose = require('mongoose');

// @connect database
const dbURL = 'mongodb://localhost:27017/sodaimama?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
mongoose.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once ('open', () => console.log('connected to database'));
mongoose.set('useFindAndModify', false);

// @app global middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// @define api controllers
const system = require('./core/api/system');
const product = require('./core/api/product');
const category = require('./core/api/category');
const auth = require('./core/api/auth');
const cart = require('./core/api/cart');


// @define routes
app.use('/product', centralAuth({'baseRoute' : 'product'}), product);
app.use('/system', centralAuth({'baseRoute' : 'system'}), system);
app.use('/category', centralAuth({'baseRoute' : 'category'}), category);
app.use('/auth', centralAuth({'baseRoute' : 'auth'}), auth);

app.use('/cart', centralAuth({'baseRoute' : 'cart'}), cart);





















app.listen(process.env.SERVER_PORT, () => {
    console.log(`SodaiMama is listening at ${process.env.SERVER_PORT}`)
})
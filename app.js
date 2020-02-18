const express = require('express');
const app = express();
const morgan = require('morgan'); // logger
const bodyParser = require('body-parser')// body parser formats request
const mongoose = require('mongoose'); 

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://rest-shop:' + 
process.env.MONGO_ATLAS_PW + 
'@node-rest-shop-pjolx.mongodb.net/test?retryWrites=true&w=majority', 
{
 useNewUrlParser: true, 
 useUnifiedTopology: true
}
);
mongoose.Promise = global.Promise; // fix Promise deprecation warnings
// middleware 
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // makes this publicly accessible
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// handling CORS errors 
app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Orgin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); 
});

// Routes whih handles request 
app.use('/products', productRoutes ); 
app.use('/orders', ordersRoutes );

// error handling if request fails 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
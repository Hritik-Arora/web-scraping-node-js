const express = require('express');

const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');

const covidDataRoute = require('./api/covidData');

app.use(morgan('dev'));     // Morgan logs all the requests made to our APIs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// CORS Handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");     // Only for development purpose
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept, Authorization",
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Headers', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }

    next(); //Called so that after setting the headers, the other routes can take over this request. 
  }
);

app.use('/covidData', covidDataRoute);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
        }
    })

});

// Every request will pass through app.use() and the function we passed to it. This is thus, a kind of middleware.

module.exports = app;
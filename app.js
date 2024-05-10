const express = require('express'); 
const app = express() ;
const productRoutes  = require('./api/routes/products'); 
const orderRoutes    = require('./api/routes/orders');
const register       = require('./api/routes/register');
const login          = require('./api/routes/login');
const questions      = require('./api/routes/questions');
const getRandomQList = require('./api/routes/getRandomQList');
const blogPosts      = require('./api/routes/blogPosts');

const morgan = require('morgan'); // login package for nodejs. This will file all request through morgan middleware. morgan will lock/pass the request
const bodyParser = require('body-parser'); // This package parses requests 
const cors = require('cors');
// const knex = require('knex'); 

// const database = knex(
//         {
//             client: 'pg',
//             connection: {
//                 host: '127.0.0.1', /* Localhost */
//                 port: 3306,
//                 user: 'postgres',
//                 password: 'Eu@20201!',
//                 database: 'learnvlsidb0'
//             }
//         }
    
// );

// console.log(database.select('*').from('users'));


// const mongoose = require('mongoose');
const allowedOrigins = ["http://localhost:3000", "http://localhost:8099","http://localhost:3001", "https://elioruzan.github.io"];

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
); 

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded(
        {
            extended: false
        }
    )
);
app.use(bodyParser.json());


// Preflight Requests:
// Before making an actual request (e.g., a GET or POST request), the browser sends an “OPTIONS” request to the target server.
// This preflight request checks whether the actual request is safe to proceed.
// The server responds with CORS-related headers indicating whether the actual request is allowed.

// app.use(
//     (req,resp,next) => {
//         resp.header('Access-Control-Allow-Origin','*'); // This gives access to all origins. can also give acces solely to the website
//         resp.header('Access-Control-Allow-Headers', 
//                         'Origin,\
//                         X-Requested-With, \
//                         Content-Type,\
//                         Accept, \
//                         Authorization'
//                     ); //Which kind of header we want to accept
//         if (req.method === 'OPTIONS') {
//             resp.header("Access-Control-Allow-Methods",
//                         "PUTS, \
//                         POST, \
//                         PATCH, \
//                         DELETE, \
//                         GET"
//             );
//             return resp.status(200).json({}); //empty object since the response is built out of all the headers we defined above
//         } else {
//             next() // without this, all requests will get stuck in this middleware
//         }
//     }
// );

// use is a middleware - incoming request has to go through app.use first 
// All the requests are going through app.use middleware
app.use('/products' ,productRoutes)  ;// all requests with suffix of '/prodcts' will be directed to ./api/routes/products
app.use('/orders',orderRoutes);
app.use('/register',register)
app.use('/login',login);
app.use('/questions', questions);
app.use('/getRandomQList', getRandomQList);
app.use('/blogPosts', blogPosts);




// if you reached here that means no route above was able to answer your request thus you reached default - error handling
app.use(
    (req,resp,next) => {
        const error = new Error('Not found ');
        error.status = 404;
        next(error); // this will foreward the error request 
    }
);


// when using 'error' as the first argument - any error occdurs while handling the other request will invode the following listener
app.use(
    (error, req,resp,next) => {
        resp.status(error.status || 500);
        resp.json(
            {
                error: {
                    message: error.message
                }
            }
        );
    }
);
// app.use(
//     (req,resp, next) => {
//         resp.status(200).json( 
//             {
//                 message: 'It works'    // This is a javascript object
//             }
//         ); 
//     }
// ); 

module.exports = app
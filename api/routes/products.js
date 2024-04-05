const express = require('express')
const router  = express.Router();

// get is a method that will handle incoming 'GET' requests. the argument is the URL. full path of the url would be /products, but the current dir when executing this file will be already in /products
router.get('/', 
    (req, resp, next) => {
        resp.status(201).json(
            {
                message: 'Handling GET requests to /products'
            }
        );
    }
); 

router.post('/', 
    (req, resp, next) => {
        const product = 
            {
                name: req.body.name,
                price: req.body.price
            };
        resp.status(201).json(
            {
                message: 'Handling POST requests to /products',
                createProduct: product
            }
        );
    }
); 

// How to pass and handle variable into GET request
router.get('/:productId', 
    (req, resp, next) => {
        const id = req.params.productId; // productId is determind by what you wrote after the ':'. that defines the variable 
        if (id === 'special') {
            resp.status(200).json(
                {
                    message: 'You discovered the special ID',
                    id: id
                }
            );
        } else {
            resp.status(200).json(
                {
                    message: 'You passed an ID',
                    id: id
                }
            );
        }
    }
); 


router.patch('/:productId',
    (req, resp, next) => {
        const id = req.params.productId; 
        resp.status(200).json(
            {
                message: `Updated product ${id}`
            }
        );
    }
)

router.delete('/:productId',
    (req, resp, next) => {
        const id = req.params.productId; 
        resp.status(200).json(
            {
                message: `Deleted product ${id} `
            }
        );
    }
)


module.exports = router
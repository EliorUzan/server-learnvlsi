const express = require('express')
const router  = express.Router();

router.get('/', 
    (req,resp,next) => {
        resp.status(200).json(
            {
                message: "Orders were fetched"
            }

        );
    }
);



router.post('/', 
    (req,resp,next) => {
        const order = 
            {   
                productID: req.body.productID,
                quantity: req.body.quantity
            };
        resp.status(201).json( 
            {
                message: `Order was created`,
                order: order
            }
        );
    }
);

router.get('/:orderID', 
    (req,resp,next) => {
        const id = req.params.orderID
        resp.status(201).json( 
            {
                message: `Order details`,
                orderID: id
            }

        );
    }
);

router.delete('/:orderID', 
    (req,resp,next) => {
        const id = req.params.orderID
        resp.status(201).json( 
            {
                message: `Order deleted`,
                orderID: id
            }

        );
    }
);

module.exports = router
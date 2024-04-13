const express = require('express');
const userDatabase = require('../../userDatabase')
const router  = express.Router();
const bcrypt = require('bcrypt')



router.post('/', 
     (req,resp,next) => {
        const register_details = 
            {   
                email: req.body.email, 
                full_name: req.body.full_name,
                password: req.body.password /*password verification (typing twice) should get done on FE */
            };
        user = userDatabase.getUser(register_details.email);
        if (user) {  /* email is not unique (db) */
            resp.status(201).json( /*registration failed - used email*/
                {
                    ok: false,
                    message: "email already is use, please check if you already have a user"
                }
            );
        } else {
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(register_details.password, saltRounds);
            userDatabase.addUser(register_details.email,hashedPassword, register_details.full_name);
            resp.status(201).json( /*registration ok */                    
                {
                    ok: true,
                    message: "Success! details passed for registration"
                }
            );
        }
    }
);



module.exports = router
const express = require('express');
const database = require('../../Database')
const router  = express.Router();
const bcrypt = require('bcrypt')



router.post('/',  
    async (req,resp,next) => {
        const register_details = 
        {   
            email: req.body.email, 
            full_name: req.body.full_name,
            password: req.body.password /*password verification (typing twice) should get done on FE */
        };
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(register_details.password, saltRounds);
        database_response = await database.addUser(register_details.email,hashedPassword, register_details.full_name);
        console.log('database_Response:',database_response)
        let msg;
        if(!database_response.ok) {
            console.log(database.response)
            if (database_response.details.includes('already exists')) {
                msg = "Email already exists, please check if you already own an account with this email address"
            } else {
                msg = "Unsuccessful Registration"
            }
        } else {
            msg = "Successfuly Registered!"
        }
        resp.status(201).json(
            {
                ok: database_response.ok,
                message: msg
            }
        )
    }
);

module.exports = router
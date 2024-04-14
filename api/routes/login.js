const express = require('express');
const bcrypt = require('bcrypt')
const userDatabase = require('../../userDatabase');
const router  = express.Router();

router.post('/', 
    (req,resp,next) => {
        const login_credentials = 
            {   
                email: req.body.email,
                password: req.body.password
            };
        console.log("login credentials: ",login_credentials)
        const user = userDatabase.getUser(login_credentials.email);
        console.log("blabla")
        if (user) { /*if user exists */ 
            let pass_ok = null;
            try {
                pass_ok = bcrypt.compareSync(login_credentials.password ,user.hashedPassword);
            } catch(error) {
                console.log("error authenticating password: ",error.message)
            }
            if (pass_ok) {
                resp.status(201).json( /*login succeeded */
                    {
                        ok: true,
                        full_name: user.full_name,
                        message: `login successful, Welcome ${user.full_name}`
                    }
                );
            } else {
                resp.status(400).json( /*login failed (pass)*/
                    {
                        ok: false,
                        message: "login failed, wrong credentials (password)"
                    }
                );
            }
        } else {
            resp.status(400).json( /*login failed (email)*/
                {
                    ok: false,
                    message: "login failed, wrong credentials (email)"
                }
            );
        }
    }
);

module.exports = router
const express = require('express');
const bcrypt = require('bcrypt')
const database = require('../../Database');
const router  = express.Router();

function verifyPassword (user, password) {
    try {
        pass_ok = bcrypt.compareSync(password ,user.hashed_password);
        return(
            {
                ok: pass_ok
            }  
        );
    } catch(error) {
        console.log("error authenticating password: ",error.message)
        return (
            {
                ok: false,
                error: error.message
            }
        )
    }
}

router.post('/', 
    async (req, resp, next) => {
        const login_credentials = {   
            email: req.body.email,
            password: req.body.password
        };
        console.log("login credentials: ", login_credentials);
        try {
            const database_response = await database.getUser(login_credentials.email, 'login');
            console.log(database_response); // Now this should display the correct response

            let pass_ok;
            if (database_response.ok) { 
                pass_ok = verifyPassword(database_response.user, login_credentials.password).ok;
            }

            if (pass_ok) {
                const profile = await database.getUser(database_response.user.email, 'profiles');
                if (profile.ok) {
                    resp.status(201).json({
                        ok: true,
                        full_name: profile.user.full_name,
                        message: `login successful, Welcome ${profile.user.full_name}`
                    });
                } else {
                    resp.status(400).json({
                        ok: false,
                        message: "login failed, wrong credentials",
                        error: profile
                    });
                }
            }
        } catch (error) {
            console.log("Error retrieving user data:", error);
            resp.status(500).json({
                ok: false,
                message: "Internal server error"
            });
        }
    }
);

module.exports = router
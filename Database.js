const userDatabase = {};
const knex = require('knex'); 

const database = knex(
        {
            client: 'pg',
            connection: {
                host: '127.0.0.1', /* Localhost */
                port: 5432,
                user: 'postgres',
                password: 'Eu@20201!',
                database: 'learnvlsidb0'
            }
        }
);

async function addUserProfile(email, full_name) {
    try {
        await database('profiles').insert({
            email: email,
            full_name: full_name,
            joining_date: new Date()
        });
        return { ok: true };
    } catch (e) {
        const registration_error = {
            ok: false,
            error: e.severity,
            details: e.detail,
            table: 'profiles'
        };
        return registration_error;
    }
}

async function addUserLogin(email, hashedPassword) {
    try {
        await database('login').insert({
            email: email,
            hashed_password: hashedPassword
        });
        return { ok: true };
    } catch (e) {
        return {
            ok: false,
            error: e.severity,
            details: e.detail,
            table: 'login'
        };
    }
}

async function addUser(email, hashedPassword, full_name) {
    const loginPromise = addUserLogin(email, hashedPassword);
    const profilePromise = addUserProfile(email, full_name);

    // Await both promises simultaneously using Promise.all
    const [LoginResponse, ProfileResponse] = await Promise.all([loginPromise, profilePromise]);

    if (LoginResponse.ok && ProfileResponse.ok) {
        return { ok: true };
    } else if (!LoginResponse.ok) {
        return {
            ok: false,
            error: LoginResponse.error,
            details: LoginResponse.details,
            table: LoginResponse.table
        };
    } else {
        return {
            ok: false,
            error: ProfileResponse.error,
            details: ProfileResponse.detail,
            table: ProfileResponse.table
        };
    }
}

    

//Function for login credentials verification
async function getUser(email, table) {
    console.log('getUser received:', email, table);
    if (table !== 'login' && table !== 'profiles') {
        console.log(`Error, table ${table} does not exist!`);
        return {
            ok: false,
            message: `Error, table ${table} does not exist!`,
            error: `Error, table ${table} does not exist!`
        };
    }

    try {
        const user = await database(table).where('email', email).first();
        if (user) {
            console.log(`Email address found - ${email}`);
            return {
                ok: true,
                message: `Email address found - ${email}`,
                user: user
            };
        } else {
            console.log(`Email not found - ${email}`);
            return {
                ok: false,
                message: `Email not found - ${email}`
            };
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            error: error
        };
    }
}


// Function to get the hashed password for a given email
// function getUser(email) {
//     return userDatabase[email];
// }

// Function to verify user credentials
// Update user data in the database
function updateUser(email, hashedPassword) {
    if (userDatabase[email]) {
        userDatabase[email].email = email,
        userDatabase[email].hashedPassword = hashedPassword,
        userDatabase[email].full_name = full_name;
        // userDatabase[email].hashedSalt = hashedSalt;
    } else {
        console.error(`User with email ${email} not found.`);
        return false;
    }
}

module.exports = {
    addUser,
    getUser,
    updateUser
};

const userDatabase = {};
const knex = require('knex'); 

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
// const host = '127.0.0.1'
const db_url = process.env.DATABASE_URL
console.log(`db url: ${db_url}`)
// const database = knex(
//         {
//             client: 'pg',
//             connection: {
//                 host: host, /* Localhost */
//                 port: 5432,
//                 user: 'postgres',
//                 password: 'Eu@20201!',
//                 database: 'learnvlsidb0'
//             }
//         }
// );

const database = knex(
    {
        client: 'pg',
        connection: db_url
    }
)

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


async function getQuestionByHeadline(headline) {
    try {
        question = await database('technical_questions')
        .where({ headline: headline })
        .select('*');
        console.log('from db: q length',question)
        if (question.length > 0) {
            const questionImagePath = 'Q_pic.png'; 
            const questionHTMLpath  = 'Q.html' ; 
            const answerImagePath   = 'A_pic.png'; 
            const answerHTMLpath    = 'A.html' ;  

            return {
                ok: true,
                questionHeadline: question[0].headline,
                questionField: question[0].field,
                questionSubField: question[0].sub_field.replace(/-/g,'_'),
                questionHTML: questionHTMLpath,
                question_picture: questionImagePath,
                answerHTML: answerHTMLpath,
                answer_picture: answerImagePath
            };
        } else {
            return { ok: false };
        }
    } catch (error) {
        console.log(error)
        return({ok: false})
    };
}

async function getRandomQList(field, sub_field='') {
    try {
        let questions = []
        if (sub_field === '') {
            questions = await database('technical_questions')
                .where({ field: field })
                .select('*');
        } else {
            questions = await database('technical_questions')
                .where({ field: field })
                .where({ sub_field: sub_field })
                .select('*');
        }
        const randomQHeadlines = questions.map(question => question.headline).sort(() => Math.random() - 0.5);
        return(
                {
                    ok: true,
                    randomQList: randomQHeadlines
                }
            );
    } catch (error) {
        console.log(error)
        return({ok: false})
    };
}
// Function to retrieve a random technical question based on pageName (corresponding with sub_field)
async function getRandomQuestion(sub_field, alreadyAskedQs = []) {
    // Need to add option for non-random question retrieval - pick a question by headline
    try {
        const questions = await database('technical_questions')
            .where({ sub_field: sub_field })
            .whereNotIn('headline', alreadyAskedQs)
            .select('*');
        
        console.log('from getRandomQuestion: questions: ',questions)
        if (questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            const randomQuestion = questions[randomIndex];
            const questionImagePath = 'Q_pic.png'; 
            const questionHTMLpath  = 'Q.html' ; 
            const answerImagePath   = 'A_pic.png'; 
            const answerHTMLpath    = 'A.html' ;  

            return {
                ok: true,
                questionHeadline: randomQuestion.headline,
                questionField: randomQuestion.field,
                questionSubField: randomQuestion.sub_field.replace(/-/g,'_'),
                questionHTML: questionHTMLpath,
                question_picture: questionImagePath,
                answerHTML: answerHTMLpath,
                answer_picture: answerImagePath
            };
        } else {
            return { ok: false };
        }
    } catch (error) {
        console.log('Error retrieving question:', error);
        return { ok: false };
    }
}


async function getBlogPostByheader(header) {
    try {
        blogPost = await database('blog_posts')
        .where({ header: header })
        .select('*');
        console.log('from db: blogPost',blogPost)
        if (blogPost.length > 0) {
            return {
                ok: true,
                header: blogPost[0].header,
                date: blogPost[0].date
            }
        } else {
            return  {
                ok: false,
                reason: "Blog Post not found in dB"
            };
        }
    } catch (error) {
        console.log(error)
        return  {
            ok: false,
            reason: "internal error retrieving blog post from DB"
        };
    };
}


module.exports = {
    addUser,
    getUser,
    updateUser,
    getRandomQuestion,
    getRandomQList,
    getQuestionByHeadline,
    getBlogPostByheader
};
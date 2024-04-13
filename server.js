const http = require('http') ; // this comes instead of 'import' might be optional to replace to import instead
const app = require('./app')

const port = process.env.PORT || 3001 ; // || sets a default value in case PORT env variable is not set
const server = http.createServer(app) ; // To the 'createSerrver' we need to pass a listener. A function that is executed whenever we get a new request which in turn return us response  
server.listen(port); // Start listening on this port
console.log(`server listening on port ${port}`)
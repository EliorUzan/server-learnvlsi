const http = require('http') ; // this comes instead of 'import' might be optional to replace to import instead
const app = require('./app')
const hostname = "0.0.0.0";
// const port = process.env.PORT || 3001 ; // || sets a default value in case PORT env variable is not set
const port = 3000
const server = http.createServer(app) ; // To the 'createSerrver' we need to pass a listener. A function that is executed whenever we get a new request which in turn return us response  
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

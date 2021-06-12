require("dotenv").config();
let express = require('express');
let app = express();
let sequelize = require('./db');

let journal = require('./controllers/journalcontroller') //we import the route object and store it in a variable called journal
let user = require('./controllers/usercontroller')

sequelize.sync();
//sequelize.sync({force: true})
app.use(require('./middleware/headers'));
app.use(express.json());


/**************
 Exposed route
**************/
app.use('/user', user);

/**************
 Protected route
 **************/
app.use('/journal', journal) //we call app.use and in the first parameter create a base URL called /journal. So our base URL will look like this: http://localhost:3000/journal. For our second parameter for the use() function, we pass in journal. This means that all routes created in the journalcontroller.js file will be sub-routes.

app.listen(3000, function(){
    console.log('App is listening on port 3000');
})
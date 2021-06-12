const { request, response } = require('express');
const express = require('express'); //We import the Express framework and store it inside the variable 'express'. This instance becomes our gateway to using Express methods.
const router = express.Router(); //We create a new variable called 'router'.  Since Line 1 gives us access to the express framework, we can now use its properties and methods.  The Router() method will return a router object for us to use.
const validateSession = require('../middleware/validate-session');
const Journal = require('../db').import('../models/journal');
//get() is one of the methods in the object and we call it here.  This allows us to complete an HTTP GET request. We pass two arguments into the .get method: 1. path  2. callback, or "handler", function
               //1          //2
router.get('/practice', validateSession, function(request, response)
{
    response.send('Hey! This is a practice route!')//Inside our callback function, we call response.send(). send() is an express method that can be called on the response object. Our response parameter is just a simple string
})

//********* JOURNAL CREATE *********/
router.post('/create', validateSession, (request, response) => {
    const journalEntry = {
        title: request.body.journal.title,
        date: request.body.journal.date,
        entry: request.body.journal.entry,
        owner: request.user.id
    }
    Journal.create(journalEntry)
        .then(journal => response.status(200).json(journal))
        .catch(err => response.status(500).json({error: err}))
})

//********* GET ALL JOURNALS *********/
router.get('/', (request, response) => {
    Journal.findAll()
        .then(journals => response.status(200).json(journals))
        .catch(err => response.status(500).json({error: err}))
});

//********* GET JOURNALS BY USER*********/
router.get('/mine', validateSession, (request, response) => {
    let userid = request.user.id;

    Journal.findAll({
        where: {owner: userid}
    })
        .then(journals => response.status(200).json(journals))
        .catch(err => response.status(500).json({error: err}))
});

//********* GET JOURNALS BY TITLE*********/
router.get('/:title', function(request, response){
    let title = request.params.title;

    Journal.findAll({
        where: {title: title}
    })
        .then(journals => response.status(200).json(journals))
        .catch(err => response.status(500).json({error: err}))
});

//********* UPDATE JOURNAL BY ID*********/
router.put('/update/:entryId', validateSession, function(request, response){
    const updateJournalEntry = {
        title: request.body.journal.title,
        date: request.body.journal.date,
        entry: request.body.journal.entry
    };

    const query = {where: {id: request.params.entryId, owner: request.user.id} };

    Journal.update(updateJournalEntry, query)
        .then(journals => response.status(200).json(journals))
        .catch(err => response.status(500).json({error: err}));
});

//********* DELETE JOURNAL BY ID*********/
router.delete('/delete/:id', validateSession, function(request, response){
    const query = {where: {id: request.params.id, owner: request.user.id}};

    Journal.destroy(query)
        .then(() => response.status(200).json({message: "Journal Entry Removed"}))
        .catch(err => response.status(500).json({error: err}))
});

module.exports = router; //we export the module for usage outside of the file
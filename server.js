/*
    Claire Lodermeier
    The purpose of this file is to create a simple chat server, where chats are stored on mongodb.
    It contains routes for saving chats and retrieving chats from the database.
*/

const express = require('express');
const app = express();
const hostname = '146.190.133.130';
const port = 80;

const mongoose = require('mongoose');
const db = mongoose.connection;
const mongoDBURL = 'mongodb+srv://clairelodermeier:zUpjw0EJocURPujc@cluster0.5tbbogk.mongodb.net/'

mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// create mongoose schema for chat messages
var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
    time: Number,
    alias: String,
    message: String
});

// create model for chat messages
var ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

app.use(express.static('public_html'));

// get request to retrieve all messages stored in db
app.get('/chats', (req, res) => {

    var chats = '';

    // get a query of all message documents sorted by time
    let p = ChatMessage.find({}).sort({ time: 1 }).exec();

    p.then((docs) => {
        // iterate through chat documents
        for (var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            if (doc['alias'] != undefined && doc['message'] != undefined) {
                // concatenate chats to chat string int the format alias|message||alias|message
                chats += doc['alias'] + '|' + doc['message'] + '||';
            }

        }
        // respond with chat string
        res.end(chats);
    });

});

// post request to save chats
app.post('/chats/post/:alias/:msg/', (req, res) => {

    // get alias and message strings from request path
    chatAlias = req.params.alias;
    chatMsg = req.params.msg;


    // create new chat document
    var chat = new ChatMessage({ time: Date.now(), alias: chatAlias, message: chatMsg });
    chat.save();

    // respond with a success message
    res.end('successfully saved to the db.');

});

app.listen(port, () => {
    console.log(`Chatty server listening at http://${hostname}:${port}/`);
})





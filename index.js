/**
 * Created by Lars on 14.04.2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var DB = require('baqend');
DB.connect('post2play');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/action', function(req, res){
    var name = req.body.user_name;
    var text = req.body.text;

    var i = parseInt(Math.random() * 100 +1);

    var data = {
        "text": name + " tries to " + text + " and rolls " + i,
        "response_type": "in_channel",
    };
    res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify(data));
});

app.post('/link', function (req, res) {
    var name = req.body.user_name;
    var text = req.body.text;

    DB.Character.load(text).then(function (char) {
        var data = {
            "text": "You are now linked to " + char.name
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }).catch(function (e) {
        var data = {
            "text": e.message
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    });


});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
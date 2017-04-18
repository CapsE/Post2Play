/**
 * Created by Lars on 14.04.2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var DB = require('baqend');
DB.connect('post2play');

var app = express();
var chars = {};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

function getCharacter(id){
    if(chars[id]){
        return new Promise(function (resolve, reject) {
            resolve(chars[id]);
        });
    }else{
        return DB.Character.find().equal('player', id).singleResult();
    }
}

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/action', function(req, res){
    console.log(req.body);
    var id = req.body.user_id;
    var name = req.body.user_name;
    var text = req.body.text;
    var i = parseInt(Math.random() * 100 +1);

    getCharacter(id).then(function (char) {

        var data = {
            "response_type": "in_channel",
            "attachments": [
                {
                    "text": char.name + " tries to " + text + " and rolls " + i,
                    "thumb_url": char.img
                }
            ]
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }).catch(function (e) {
        var data = {
            "text": "Please use /link <id> to link your character",
            "attachments": [
                {
                    "text": e.message
                }
            ]
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    });
});

app.post('/link', function (req, res) {
    var id = req.body.user_id;
    var text = req.body.text;

    DB.Character.load(text).then(function (char) {
        chars[id] = char;
        var data = {
            "attachments": [
                {
                    "text":"You are now linked to " + char.name,
                    "image_url":char.img
                }
            ]
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
        char.player = id;
        char.update();
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
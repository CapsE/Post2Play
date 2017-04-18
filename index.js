/**
 * Created by Lars on 14.04.2017.
 */

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/action', function(req, res){
    console.log(req.body);
    var name = req.body.user_name;
    var text = req.body.text;

    var i = parseInt(Math.random() * 100 +1);
    var message = "";

    var data = {
        "text": name + "tries to " + text + "and rolls " + i,
        "response_type": "in_channel",
    };
    res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify(data));
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
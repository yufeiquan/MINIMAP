var path = require('path');
var express = require('express');
var request = require('request');
var app = express();

var GOOGLE_KEY = 'AIzaSyDMHhUmJYxgR9e4ZZ_OHW18r7D4fJVDrfc';
var places_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/nearbysearch', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/nearby_search.html'));
});

app.get('/places-info', function(req, api_res) {
    var radius = req.query.radius ? req.query.radius : 150;
    var params = {
        'key': GOOGLE_KEY,
        'location': req.query.lat + ',' + req.query.lng,
        'radius': radius,
        'type': req.query.type
    };

    request({url: places_url, qs: params}, function(err, res, body) {
        console.log(res);
        if (res.statusCode == 200) {
            console.log(body)
            api_res.json(body)
        }
    });
});

app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/assets', express.static('assets'))

app.listen(8080, function() {
    console.log('app started on port 8080');
});

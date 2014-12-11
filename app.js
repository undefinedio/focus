var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var Twitter = require('node-twitter');

var twitterRestClient = new Twitter.RestClient(
    'EPklYpsfzCzP7iJKXs0TsDDew',
    'w4gj6UooZSRiDhACX20BJiwyBucqegeOI6VYlJvo1Hi8lQqmfs',
    '2914457025-t2j59RCqJ4Zq5uXC4Kn6f1OBkKOWaKy3MIo3Gci',
    'IlrUaVY81944aH2vmpVl9LCeq6nlp0cSkKsBZcM8dtPp1'
);
/*******
 * DEFINE ROUTE
 *******/

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

/*******
 * LISTEN FOR SOCKET MESSAGES
 *******/

io.on('connection', function(socket){
    socket.on('upload', function(data) {
        var matches = data.match(/^data:.+\/(.+);base64,(.*)$/);
        var ext = matches[1];
        var base64_data = matches[2];
        var buffer = new Buffer(base64_data, 'base64');

        fs.writeFile(__dirname + '/img.png', buffer, function (err) {
            tweetPicture('img.png');
        });
    });
});


function tweetPicture(imageName) {
    twitterRestClient.statusesUpdateWithMedia(
        {
            'status': 'I pooped my pants!',
            'media[]': imageName
        },
        function(error, result) {
            if (error) {
                console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
            }
            if (result) {
                console.log(result);
            }
        }
    );
}
/*******
 * START SERVER
 *******/

http.listen(3000, function(){
    console.log('listening on *:3000');
});
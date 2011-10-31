var fs = require('fs');
var http = require('http');
var everyauth = require('everyauth');
var express   = require('express');
var uuid = require('node-uuid');

var FacebookClient = require('facebook-client').FacebookClient;
var facebook = new FacebookClient();

everyauth.facebook
    .appId(process.env.FACEBOOK_APP_ID)
    .appSecret(process.env.FACEBOOK_SECRET)
    .scope('user_likes,user_photos,user_photo_video_tags')
    .entryPath('/')
    .redirectPath('/home')
    .findOrCreateUser(function() {
       return({});
    });

var app = express.createServer(
    express.logger(),
    express.static(__dirname + '/client'),
    express.cookieParser(),
    express.session({ secret: process.env.SESSION_SECRET || 'xscdvwfgerhgjyk.bvhsudkulbi.ku' }),
    function(requestuest, response, next) {
        everyauth.facebook.myHostname(
            (requestuest.headers['x-forwarded-proto'] || 'http') +
            '://' + requestuest.headers.host
        );
        next();
    },
    everyauth.middleware(),
    require('facebook').Facebook()
);

app.get('/home', function(request, response){
    if (request.session.auth) {
        var token = request.session.auth.facebook.accessToken;
        facebook.getSessionByAccessToken(token)(function (session) {
//            session.graphCall('/me/movies') (function(result) {
                response.render('home.ejs', {
                    layout: false,
                    app: app,
                    token: token,
//                    movies: result.data
                });
//            });
        });
    } else {
        response.redirect('/');
    }
});

var getBacon = function(actor, callback, fallback) {
    console.log("GET " + actor);
    var client = http.createClient(80, 'oracleofbacon.org');
    var creq = client.request('GET', '/cgi-bin/movielinks?a=Kevin+Bacon&b=' + encodeURI(actor) +
                              '&use_using=1&u0=on&use_genres=1&g0=on&g4=on&g8=on&g12=on&g16=on&g20=on&g24=on&g1=on&g5=on&g9=on&g13=on&g17=on&g21=on&g25=on&g2=on&g6=on&g10=on&g14=on&g18=on&g22=on&g26=on&g3=on&g7=on&g11=on&g15=on&g19=on&g23=on&g27=on&g28=on');
    creq.setHeader('Host', 'oracleofbacon.org');
    var body = [];
    creq.on('response', function (cres) {
        cres.on('data', function (data) {
            body.push(data);
        });
        cres.on('end', function () {
            body = body.join('');
            var match = body.match(/Bacon number of ([\d]+)\./);
            if (match) {
                callback(match[1]);
            } else {
                if (!fallback) {
                    getBacon(actor + ' (I)', callback, true);
                    return;
                } else {
                    callback(100);
                }
            }
        });
    });
    creq.end();
};
app.get('/bacon', function(request, response) {
    var actor = request.param('actor', '');
    getBacon(actor, function(bacon) {
        response.write('{"bacon":' + bacon + '}');
        response.end();
    });
});

var flushGames = function() {
    fs.writeFileSync('games.json', '{"i1319868300073":{"id":1319868300073,"challenger":"jamesgpearce","challenged":"davidkaneda","challenger_actor":"Uma Thurman","challenger_bacon":"1","winner":""},"i1319868624027":{"id":1319868624027,"challenger":"jamesgpearce","challenged":"jaynepearce","challenger_actor":"Ellen Page","challenger_bacon":"1","winner":""},"i1319868300074":{"id":1319868300074,"challenger":"davidkaneda","challenged":"jamesgpearce","challenger_actor":"Uma Thurman","challenger_bacon":"1","winner":"won by davidkaneda","challenged_actor":"Jean Reno","challenged_bacon":"2"},"i1319868624028":{"id":1319868624028,"challenger":"adityabansod","challenged":"jamesgpearce","challenger_actor":"Ellen Page","challenger_bacon":"1","winner":"a draw","challenged_actor":"Ellen Page","challenged_bacon":"1"}}');
};
var getGames = function() {
    return JSON.parse(fs.readFileSync('games.json').toString()); //oioioi
};
var putGames = function(games) {
    fs.writeFileSync('games.json', JSON.stringify(games));
};

app.get('/startgame', function(request, response) {
    var games = getGames();
    var id = new Date().getTime();
    var actor = request.param('actor', '');
    getBacon(actor, function(bacon) {
        var game = {
            id: id,
            challenger: request.session.auth.facebook.user.username,
            challenged: request.param('challenged', ''),
            challenger_actor: actor,
            challenger_bacon: bacon,
            winner: ''
        };
        games['i'+id] = game;
        putGames(games);
        console.log(game);
        response.write(JSON.stringify(game));
        response.end();
    });
});

app.get('/mygames', function(request, response) {
    var challenger = request.param('challenger', false);
    var me = request.session.auth.facebook.user.username;
    var mygames = [];
    var games = getGames();
    for (id in games) {
        var game = games[id];
        if ((challenger && game.challenger==me) || (!challenger && game.challenged==me)) {
            mygames.push(game);
        }
    }
    response.write(JSON.stringify(mygames));
    response.end();
});

app.get('/playgame', function(request, response) {
    var games = getGames();
    var id = request.param('id', '');
    var actor = request.param('actor', '');
    getBacon(actor, function(bacon) {
        var games = getGames();
        var game = games['i'+id];
        if(game) {
            game.challenged_actor = actor;
            game.challenged_bacon = bacon;
            game.winner = (game.challenged_bacon == game.challenger_bacon) ? 'a draw' : 'won by ' +
                (game.challenged_bacon < game.challenger_bacon ? game.challenged : game.challenger);
            games['i' + id] = game;
            putGames(games);
            response.write(JSON.stringify(game));
        }
        response.end();
    });
});

flushGames();
app.listen(process.env.PORT);

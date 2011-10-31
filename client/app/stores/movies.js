Bacon.stores.movies = new Ext.data.Store({
    model: Ext.regModel('Movie', {
        fields: [
            'name'
        ],
        _actors: null,
        actors: function(callback, scope) {
            if (this._actors === null) {
                var movie = this;
                Ext.util.JSONP.request({
                    url: 'http://www.imdbapi.com/',
                    params: { t: movie.get('name') },
                    callbackKey: 'callback',
                    callback: function (data) {
                        movie._actors = [];
                        data.Actors.split(',').forEach(function(actor) {
                            movie._actors.push(actor.trim());
                        });
                        callback.call(scope||this, movie._actors);
                    }
                });
            } else {
                callback.call(scope||this, this._actors);
            }
        }
    }),
    autoLoad: true,
    proxy: {
        type: 'scripttag',
        url: 'https://graph.facebook.com/me/movies?access_token=' + TOKEN,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        load: function () {
            this.data.items.forEach(function(movie) {
                movie.actors(function(actorNames) {
                    actorNames.forEach(function(actorName) {
                        Bacon.stores.actors.add({name:actorName});
                    });
                });
            });
        }
    }
});
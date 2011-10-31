Bacon.stores.actors = new Ext.data.Store({
    model: Ext.regModel('Actor', {
        fields: [
            'name'
        ],
        _bacon: null,
        bacon: function(callback, scope) {
            if (this._bacon === null) {
                Ext.util.JSON.request({
                    url: '/bacon',
                    params: {actor: movie.get('name')},
                    callback: function (data) {
                        actor._bacon = data.bacon;
                        callback.call(scope||this, actor._bacon);
                    }
                });
            } else {
                callback.call(scope||this, actor._bacon);
            }
        }
    })
});
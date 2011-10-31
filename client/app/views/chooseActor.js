Bacon.views.chooseChallengerActor = Ext.extend(Ext.List, {
    emptyText: '<div class="oops"><strong>Oh no!</strong> You don&#8217;t have any movies on your Facebook profile.<br><a href="http://www.facebook.com">Head over to Facebook</a>, and add some!</div>',
    store: Bacon.stores.actors,
    itemTpl: '{name}',
    listeners: {
        selectionchange: function (sm, records){
            if (records[0] !== undefined) {
                Bacon.facebook.sendChallenge(this.opponent.id, this.opponent.name, records[0].data.name);
            }
        }
    }
});


Bacon.views.chooseChallengedActor = Ext.extend(Ext.List, {
    emptyText: '<div class="oops"><strong>Oh no!</strong> You don&#8217;t have any movies on your Facebook profile.<br><a href="http://www.facebook.com">Head over to Facebook</a>, and add some!</div>',
    store: Bacon.stores.actors,
    itemTpl: 'Reply with {name}',
    listeners: {
        selectionchange: function (sm, records) {
            if (records[0]) {
                Bacon.facebook.sendPlay(this.game.id, records[0].data.name);
            }
        }
    }
});
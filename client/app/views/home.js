challenged = new Ext.List({
        height: 'auto',
        scroll: false,
        store: Bacon.stores.challengergames,
        itemTpl: '{challenged}'
    });

Bacon.views.home = Ext.extend(Ext.Panel, {
    cls: 'home',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scroll: 'vertical',
    items: [{
        xtype: 'component',
        html: new Array(
            '<div class="baconcenter"><img src="/img/bacon2.png"></div>',
            '<div class="wins_losses">',
                '<div><h4>Wins</h4><span>4</span></div>',
                '<div><h4>Losses</h4><span>6</span></div>',
            '</div>'
        ).join('')
    }, {
        xtype: 'component',
        html: '<h2>Start a new game...</h2>'
    }, {
        xtype: 'button',
        text: 'Select an opponent',
        handler: Bacon.selectAFriend,
        scope: this
    }, {
        xtype: 'component',
        html: '<h2>You&#8217;ve been challenged by:</h2>'
    }, {
        xtype: 'list',
        height: 'auto',
        scroll: false,
        store: Bacon.stores.challengedgames,
        itemTpl: '{challenger}',
        listeners: {
            selectionchange: function(sm, records) {
                if (records[0]) {
                    var actorCard = new Bacon.views.chooseChallengedActor({
                        game: records[0].data
                    });
                    Bacon.viewport.setActiveItem(actorCard, 'slide');
                }
            }
        }
    }, {
        xtype: 'component',
        html: '<h2>You challenged:</h2>'
    }, challenged]
});
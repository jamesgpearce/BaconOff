Ext.regModel('Game', {
    fields: [
        "id" ,"challenger", "challenged", "challenger_actor", "challenger_bacon", "winner"
    ]
});

Bacon.stores.challengedgames = new Ext.data.Store({
    model: 'Game',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/mygames',
        reader: {
            type: 'json'
        }
    }
});

Bacon.stores.challengergames = new Ext.data.Store({
    model: 'Game',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/mygames?challenger=true',
        reader: {
            type: 'json'
        }
    }
});
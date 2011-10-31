Bacon.stores.friends = new Ext.data.Store({
    model: Ext.regModel('Friend', {
        fields: [
            'id', 'name'
        ]
    }),
    sorters: 'name',
    autoLoad: false,
    pageSize: 5000,
    proxy: {
        type: 'scripttag',
        url: 'https://graph.facebook.com/me/friends?access_token=' + TOKEN,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getGroupString: function(record){
        return record.get('name').charAt(0).toUpperCase();
    }
});
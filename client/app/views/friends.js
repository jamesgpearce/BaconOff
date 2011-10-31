Bacon.views.friends = Ext.extend(Ext.List, {
    cls: 'friends-list',
    store: Bacon.stores.friends,
    itemTpl: '<div class="friend-avatar" style="background-image: url(https://graph.facebook.com/{id}/picture?type=normal);"></div> <h3>{name}</h3>',
    grouped: true,
    indexBar: true,
    listeners: {
        selectionchange: function (sm, records){
            if (records[0] !== undefined) {
                console.log(records[0]);

                var actorCard = new Bacon.views.chooseChallengerActor({
                    opponent: records[0].data
                });

                console.log(actorCard);

                // Tell the parent panel to animate to the new card
                this.ownerCt.setActiveItem(actorCard, 'slide');
            }
        }
    },
    scope: this
});
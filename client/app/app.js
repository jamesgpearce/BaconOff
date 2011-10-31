var movies, actors, friends, viewport;

new Ext.Application({
    name: 'Bacon',
    launch: function() {
        // Clear out the loading indicator
        Ext.select('.bacon-beacon').remove();

        this.viewport = new Ext.Panel({
            fullscreen: true,
            dockedItems: [{
                xtype:'toolbar',
                title:'BaconOff'
            }],
            layout: 'card',
            items: [ new Bacon.views.home() ]
        });
    },

    selectAFriend: function(){
        Bacon.stores.friends.load();
        Bacon.viewport.setActiveItem( new Bacon.views.friends(), {
            type: 'slide',
            direction: 'up'
        } );
    },

    chooseChallengerActor: function(){
        Bacon.viewport.setActiveItem( new Bacon.views.chooseChallengerActor() );
    },

    chooseChallengedActor: function(){
        Bacon.viewport.setActiveItem( new Bacon.views.chooseChallengedActor() );
    },

    facebook: {

        sendChallenge: function(friendId, friendName, actorName){

            if (friendId) {
                FB.ui( { method: 'apprequests',
                    message: 'You have been challenged to a BaconOff!',
                    to: friendId
                }, function () {
                    Ext.Ajax.request({
                        url: '/startgame?challenged=davidkaneda&actor=' + encodeURI(actorName),
                        success: function(response, opts) {
                            var obj = Ext.decode(response.responseText);
                            Ext.Msg.alert('Game started', 'Now wait for the other user!', function() {
                                Bacon.stores.challengergames.load();
                                Bacon.viewport.setActiveItem(0);
                            });
                        },
                        failure: function(response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });

                    Bacon.viewport.setActiveItem(0);
                });
                console.log('Fake sent FB app request to ' + friendName);
            };

        },

        sendPlay: function(gameId, actorName){

            Ext.Ajax.request({
                url: '/playgame?id=' + gameId + '&actor=' + encodeURI(actorName),
                success: function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    Ext.Msg.alert(obj.winner,
                                  obj.challenger_actor + ' ('+ obj.challenger_bacon +') vs ' + obj.challenged_actor + ' ('+ obj.challenged_bacon +')',
                                  function() {
                        Bacon.viewport.setActiveItem(0);
                    });
                    FB.api('/me/baconoff:select&actor=' + encodeURI(actorName), 'post',  function(response) {
                        console.log(response);
            		});

                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }

    }
});

Ext.LoadingSpinner =
    '<div class="bacon-beacon-wrap">' +
      '<div class="bacon-beacon">' +
          '<div></div>' +
          '<div></div>' +
          '<div></div>' +
      '</div>' +
    '</div>';

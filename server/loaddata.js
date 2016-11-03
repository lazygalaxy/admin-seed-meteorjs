import {SystemCollection} from '../imports/api/collections';
import {MemberCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

Meteor.startup(function() {
    var teamAssets = Assets.getText('teams.csv').split(/\r\n|\n/);
    console.info('updating teams: ' + teamAssets.length);
    teamAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            TeamCollection.upsert({
                _id: fields[0]
            }, {label: fields[1]});
        }
    });

    var memberAssets = Assets.getText('members.csv').split(/\r\n|\n/);
    console.info('updating members: ' + memberAssets.length);
    memberAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            MemberCollection.upsert({
                _id: fields[0]
            }, {
                surname: fields[1],
                name: fields[2],
                teams: fields[3].split(':')
            });
        }
    });

    var systemAssets = Assets.getText('systems.csv').split(/\r\n|\n/);
    console.info('updating systems: ' + systemAssets.length);
    systemAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            SystemCollection.upsert({
                _id: fields[0]
            }, {
                label: fields[1],
                teamId: fields[2]
            });
        }
    });
});

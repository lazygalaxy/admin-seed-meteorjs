import {MemberCollection} from '../imports/api/collections';
import {ScoreCollection} from '../imports/api/collections';
import {SystemCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

Meteor.startup(function() {
    var memberAssets = Assets.getText('vb_members.csv').split(/\r\n|\n/);
    console.info('updating members: ' + memberAssets.length);
    memberAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            MemberCollection.upsert({
                _id: fields[0]
            }, {
                surname: fields[1],
                name: fields[2],
                isAdmin: (fields[3] === "true"),
                teams: fields[4].split(':')
            });
        }
    });

    var scoreAssets = Assets.getText('vb_scores.csv').split(/\r\n|\n/);
    console.info('updating scores: ' + scoreAssets.length);
    scoreAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            ScoreCollection.upsert({
                _id: fields[0] + '_' + fields[1]
            }, {
                systemId: fields[0],
                memberId: fields[1],
                value: parseInt(fields[2])
            });
        }
    });

    var systemAssets = Assets.getText('vb_systems.csv').split(/\r\n|\n/);
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

    var teamAssets = Assets.getText('vb_teams.csv').split(/\r\n|\n/);
    console.info('updating teams: ' + teamAssets.length);
    teamAssets.forEach(function(entry) {
        if (entry) {
            var fields = entry.split(';');
            TeamCollection.upsert({
                _id: fields[0]
            }, {label: fields[1]});
        }
    });
});

import {MemberCollection} from '../imports/api/collections';
import {ScoreCollection} from '../imports/api/collections';
import {SystemCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

let memberId = 'v000053';
let member = MemberCollection.findOne({_id: memberId});

Meteor.startup(() => {
    Meteor.publish('members', function() {
        return MemberCollection.find({
            teams: {
                $in: member.teams
            }
        });
    });

    Meteor.publish('scores', function() {
        // let systems = SystemCollection.find({
        //     teamId: {
        //         $in: member.teams
        //     }
        // });
        //
        // return ScoreCollection.find({
        //     systemId: {
        //         $in: systems
        //     }
        // });
        return ScoreCollection.find({});
    });

    Meteor.publish('systems', function() {
        return SystemCollection.find({
            teamId: {
                $in: member.teams
            }
        });
    });

    Meteor.publish('teams', function() {
        return TeamCollection.find({
            _id: {
                $in: member.teams
            }
        });
    });
});

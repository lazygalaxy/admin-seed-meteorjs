import {MemberCollection} from '../imports/api/collections';
import {SystemCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

let memberId = 'epapa';
let member = MemberCollection.findOne({_id: memberId});

Meteor.startup(() => {
    Meteor.publish('systems', function() {
        return SystemCollection.find({
            teamId: {
                $in: member.teams
            }
        });
    });

    Meteor.publish('members', function() {
        return MemberCollection.find({
            teams: {
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

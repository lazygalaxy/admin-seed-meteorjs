import {check} from 'meteor/check';

import {MemberCollection} from '../imports/api/collections';
import {ScoreCollection} from '../imports/api/collections';
import {SystemCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

Meteor.startup(() => {
    Meteor.publish('members', function() {
        if (this.userId) {
            let member = MemberCollection.findOne({
                _id: Meteor.users.findOne(this.userId).username
            });
            return MemberCollection.find({
                teams: {
                    $in: member.teams
                }
            });
        } else {
            this.ready();
            return;
        }
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
        if (this.userId) {
            let member = MemberCollection.findOne({
                _id: Meteor.users.findOne(this.userId).username
            });
            return SystemCollection.find({
                teamId: {
                    $in: member.teams
                }
            });
        } else {
            this.ready();
            return;
        }
    });

    Meteor.publish('teams', function() {
        if (this.userId) {
            let member = MemberCollection.findOne({
                _id: Meteor.users.findOne(this.userId).username
            });
            return TeamCollection.find({
                _id: {
                    $in: member.teams
                }
            });
        } else {
            this.ready();
            return;
        }
    });
});

//meteor methods
Meteor.methods({
    'score.update' (systemId, memberId, score) {
        check(systemId, String);
        check(memberId, String);
        check(score, Number);

        ScoreCollection.upsert({
            _id: systemId + '_' + memberId
        }, {
            systemId: systemId,
            memberId: memberId,
            value: score
        });
    }
});

import {check} from 'meteor/check';

import {MemberCollection} from '../imports/api/collections';
import {ScoreCollection} from '../imports/api/collections';
import {SystemCollection} from '../imports/api/collections';
import {TeamCollection} from '../imports/api/collections';

Meteor.startup(() => {
    //TODO: abstract repetitive pattern for each of the following publishers
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
        if (this.userId) {
            let member = MemberCollection.findOne({
                _id: Meteor.users.findOne(this.userId).username
            });
            //TODO:figure out the exact criteria so only relevant scores are returned back
            return ScoreCollection.find();
        } else {
            this.ready();
            return;
        }
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

        //TODO: would be goot to have a getMember function that does the following
        let member = MemberCollection.findOne({
            _id: Meteor.users.findOne(this.userId).username
        });

        if (member.isAdmin) {
            ScoreCollection.upsert({
                _id: systemId + '_' + memberId
            }, {
                systemId: systemId,
                memberId: memberId,
                value: score
            });
            return 'Score succesfully updated.';
        } else {
            //TODO: understand different error codes and their impact
            throw new Meteor.Error(500, "You have insufficient privileges to update scores.");
        }
    }
});

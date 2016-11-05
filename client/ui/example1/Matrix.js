//react
import React from 'react';

//meteor
import {createContainer} from 'meteor/react-meteor-data';

//react components
import Page from '../Page';

//collections
import {MemberCollection} from '../../../imports/api/collections';
import {ScoreCollection} from '../../../imports/api/collections';
import {SystemCollection} from '../../../imports/api/collections';
import {TeamCollection} from '../../../imports/api/collections';

$(function() {
    // Options for peity charts
    $("span.pie").peity("pie", {
        fill: ['#1ab394', '#d7d7d7', '#ffffff']
    });

    $(".line").peity("line", {
        fill: '#1ab394',
        stroke: '#169c81'
    });
});

class Matrix extends React.Component {
    _renderTables() {
        return this.props.teams.map((team) => {
            return (
                <div key={team._id} className="ibox float-e-margins">
                    <div className="ibox-title">
                        <h5>{team.label}</h5>
                    </div>
                    <div className="ibox-content">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    {this._renderTableHeaders(team)}
                                </tr>
                            </thead>
                            <tbody>
                                {this._renderTableRows(team)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        });
    }

    _renderTableHeaders(team) {
        let filteredSystems = this.props.systems.filter(system => system.teamId == team._id);
        return filteredSystems.map((system) => {
            return (
                <th key={system._id}>{system.label}</th>
            );
        });
    }

    _renderTableRows(team) {
        let filteredMembers = this.props.members.filter(member => member.teams.indexOf(team._id) != -1);
        return filteredMembers.map((member) => {
            return (
                <tr key={member._id}>
                    <td>{member.name}</td>
                    {this._renderScores(team, member)}
                </tr>
            );
        });
    }

    _renderScores(team, member) {
        let filteredSystems = this.props.systems.filter(system => system.teamId == team._id);
        return filteredSystems.map((system) => {
            return (
                <td key={system._id}>{this.props.scoreObj.getScore(member._id, system._id)}</td>
            );
        });
    }

    render() {
        return (
            <Page title='Matrix'>
                {this._renderTables()}
            </Page>
        )
    }
}

class ScoreObj {
    constructor(scores) {
        this.scoreMap = new Map();

        scores.map((score) => {
            if (!this.scoreMap.get(score.memberId)) {
                this.scoreMap.set(score.memberId, new Map());
            }
            this.scoreMap.get(score.memberId).set(score.systemId, score.value);
        });
    }

    getScore(memberId, systemId) {
        if (this.scoreMap.get(memberId) && this.scoreMap.get(memberId).get(systemId)) {
            return this.scoreMap.get(memberId).get(systemId);
        }
        return '-';
    }
}

export default createContainer(() => {
    Meteor.subscribe('members');
    Meteor.subscribe('systems');
    Meteor.subscribe('scores');
    Meteor.subscribe('teams');

    return {
        scoreObj: new ScoreObj(ScoreCollection.find({}).fetch()),
        systems: SystemCollection.find({}, {
            sort: {
                label: 1
            }
        }).fetch(),
        members: MemberCollection.find({}, {
            sort: {
                name: 1
            }
        }).fetch(),
        teams: TeamCollection.find({}, {
            sort: {
                label: 1
            }
        }).fetch()
    };
}, Matrix);

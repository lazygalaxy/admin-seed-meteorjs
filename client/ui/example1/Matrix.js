//react
import React from 'react';
import 'jquery-knob'

//meteor
import {createContainer} from 'meteor/react-meteor-data';

//react components
import Page from '../Page';

//collections
import {MemberCollection} from '../../../imports/api/collections';
import {ScoreCollection} from '../../../imports/api/collections';
import {SystemCollection} from '../../../imports/api/collections';
import {TeamCollection} from '../../../imports/api/collections';

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
            let combinedId = system._id + '.' + member._id;
            let scoreValue = this.props.scoreObj.getScore(member._id, system._id);

            return (
                <td key={combinedId}>
                    <input className="dial" type="text" data-memberid={member._id} data-systemid={system._id} value={scoreValue} onChange={this._nothing.bind(this)} data-fgColor="#1AB394" data-min="0" data-max="5" data-width="65" data-height="65"/>
                </td>
            );
        });
    }

    componentDidUpdate() {
        $(".dial").knob({
            'release': function(v) {
                let memberId = this.$.attr('data-memberid');
                let systemId = this.$.attr('data-systemid');
                console.info('hello ' + memberId + ' ' + systemId + ' ' + v);
            }
        });
    }

    //used for input to avoid react warnings
    _nothing() {}

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
        return 0;
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

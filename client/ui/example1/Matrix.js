//react
import React from 'react';
import cx from 'react-classset'

//react components
import Page from '../Page';

// other libs
import 'jquery-knob'
import 'bootstrap-touchspin'

//meteor
import {createContainer} from 'meteor/react-meteor-data';

//collections
import {MemberCollection} from '../../../imports/api/collections';
import {ScoreCollection} from '../../../imports/api/collections';
import {SystemCollection} from '../../../imports/api/collections';
import {TeamCollection} from '../../../imports/api/collections';

class Matrix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lockEdit: true
        };
    }

    //other functions
    _toggleLockEdit() {
        this.setState({
            lockEdit: !this.state.lockEdit
        });
    }

    _renderContent() {
        return (
            <div>
                <div className="switch">
                    Lock Edit
                    <div className="onoffswitch">
                        <input type="checkbox" id="globalLockEdit" checked={this.state.lockEdit} className="onoffswitch-checkbox" onClick={this._toggleLockEdit.bind(this)} readOnly/>
                        <label className="onoffswitch-label" htmlFor="globalLockEdit">
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
                <div className="tabs-container">
                    <ul className="nav nav-tabs">
                        {this._renderTabTitles()}
                    </ul>
                    <div className="tab-content">
                        {this._renderTabContents()}
                    </div>
                </div>
            </div>
        )

    }

    _renderTabTitles() {
        let index = 0;
        return this.props.teams.map((team) => {
            let attr = [];
            if (index++ == 0) {
                attr.push('active');
            }
            let hrefValue = '#' + team._id;

            return (
                <li key={team._id} className={cx(...attr)}>
                    <a data-toggle="tab" href={hrefValue}>{team.label}</a>
                </li>
            );
        });
    }

    _renderTabContents() {
        let index = 0;
        return this.props.teams.map((team) => {
            let attr = ['tab-pane'];
            if (index++ == 0) {
                attr.push('active');
            }

            return (
                <div key={team._id} id={team._id} className={cx(...attr)}>
                    <div className="panel-body">
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
            let scoreValue = this.props.scoreObj.getScore(system._id, member._id);

            return (
                <td key={combinedId}>
                    <input className="touchspin" type="text" id={combinedId} value={scoreValue} onChange={this._nothing.bind(this)} disabled={this.state.lockEdit}/>
                </td>
            );
        });
    }

    componentDidUpdate() {
        $(".touchspin").TouchSpin({min: 0, max: 5, buttondown_class: 'btn btn-white', buttonup_class: 'btn btn-white'}).on('change', function(event) {
            let systemId = event.target.id.split('.')[0]
            let memberId = event.target.id.split('.')[1]
            let score = parseInt(event.target.value);

            Meteor.call('score.update', systemId, memberId, score);
        });
    }

    //used for input to avoid react warnings with callbacks
    _nothing() {
        console.info('nothing happened!');
    }

    render() {
        return (
            <Page title='Matrix'>
                {this._renderContent()}
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

    getScore(systemId, memberId) {
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

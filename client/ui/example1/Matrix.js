//react
import React from 'react';
import cx from 'react-classset'

//react components
import Page from '../Page';

//other
import Chart from 'chart.js';
import 'peity'

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
                {/* TODO: add switch to its own react component */}
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
                <div>
                    <canvas id="radarChart"></canvas>
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
                                <tr>
                                    <td></td>
                                    {this._renderTableCharts(team)}
                                </tr>
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

    _renderTableCharts(team) {
        let filteredSystems = this.props.systems.filter(system => system.teamId == team._id);
        return filteredSystems.map((system) => {
            let filteredMembers = this.props.members.filter(member => member.teams.indexOf(team._id) != -1);
            let data = filteredMembers.map((member) => {
                return this.props.scoreObj.getScore(system._id, member._id);
            });
            return (
                <td key={system._id}>
                    <span className="pie">{data.join()}</span>
                </td>
            );
        });
    }

    _renderScores(team, member) {
        let filteredSystems = this.props.systems.filter(system => system.teamId == team._id);

        return filteredSystems.map((system) => {
            let combinedId = system._id + '.' + member._id;
            let scoreValue = this.props.scoreObj.getScore(system._id, member._id);

            let style = {
                width: '100%'
            };

            return (
                <td key={combinedId}>
                    <input type='number' min='0' max='5' id={combinedId} value={scoreValue} onChange={this._scoreUpdate.bind(this)} style={style} disabled={this.state.lockEdit}/>
                </td>
            );
        });
    }

    //used for input to avoid react warnings with callbacks
    _scoreUpdate(event) {
        let score = parseInt(event.target.value) % 10;
        if (score < 0 || score > 5) {
            return false;
        }

        let systemId = event.target.id.split('.')[0]
        let memberId = event.target.id.split('.')[1]

        Meteor.call('score.update', systemId, memberId, score, function(error, result) {
            if (error) {
                toastr.error(error.reason);
            }
            if (result) {
                toastr.success(result);
            }
        });
    }

    componentDidUpdate() {
        $("span.pie").peity("pie", {
            radius: 40,
            fill: function(_, i, all) {
                var hue = parseInt((i / all.length) * 360)
                return "hsl(" + hue + ",100%,50%)"
            }
        })
    }

    componentDidMount() {
        var radarData = {
            labels: [
                "Eugene",
                "Tobias",
                "Norbert",
                "Rainer",
                "Roger",
                "Evangelos",
                "Torsten"
            ],
            datasets: [
                {
                    label: "ULLink",
                    backgroundColor: "rgba(179,26,148,0.2)",
                    borderColor: "rgba(179,26,148,1)",
                    data: [
                        5,
                        4,
                        1,
                        3,
                        0,
                        5,
                        2
                    ]
                }, {
                    label: "Horizon",
                    backgroundColor: "rgba(26,179,148,0.2)",
                    borderColor: "rgba(26,179,148,1)",
                    data: [
                        1,
                        3,
                        5,
                        0,
                        0,
                        3,
                        4
                    ]
                }
            ]
        };

        var radarOptions = {
            responsive: true
        };

        var ctx5 = document.getElementById("radarChart").getContext("2d");
        new Chart(ctx5, {
            type: 'radar',
            data: radarData,
            options: radarOptions
        });
    }

    render() {
        return (
            <Page title='Matrix'>
                {this._renderContent()}
            </Page>
        )
    }
}

//TODO: score object could be placed in its own file
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

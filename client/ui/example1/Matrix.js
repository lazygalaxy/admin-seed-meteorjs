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
                                    <th></th>
                                    {this._renderTableHeaders(team)}
                                </tr>
                            </thead>
                            <tbody>
                                {this._renderTableRows(team)}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    {this._renderTableCharts(team)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {this._renderInfo(team)}
                </div>
            );
        });
    }

    _renderTableHeaders(team) {
        let filteredSystems = this.props.systemObj.systems.filter(system => system.teamId == team._id);
        return filteredSystems.map((system) => {
            return (
                <th key={system._id}>{system.label}</th>
            );
        });
    }

    _renderTableRows(team) {
        let filteredMembers = this.props.members.filter(member => member.teams.indexOf(team._id) != -1);
        return filteredMembers.map((member) => {
            let combinedId = '#' + team._id + '_' + member._id;
            return (
                <tr key={member._id}>
                    <td>
                        {member.name}
                    </td>
                    <td>
                        <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target={combinedId}>
                            <i className="fa fa-info"></i>
                        </button>
                    </td>
                    {this._renderScores(team, member)}
                </tr>
            );
        });
    }

    _readableArray(array) {
        if (array.length == 0) {
            return null;
        }
        if (array.length == 1) {
            return array[0].label;
        }

        let returnString = array[0].label;
        for (var i = 1; i < array.length; i++) {
            returnString = returnString + ', ' + array[i].label;
        }

        return returnString;
    }

    _renderInfo(team) {
        let filteredMembers = this.props.members.filter(member => member.teams.indexOf(team._id) != -1);
        return filteredMembers.map((member) => {
            let combinedId = team._id + '_' + member._id;

            let leadSystems = this.props.scoreObj.getSystems(4, member._id);
            let deputySystems = this.props.scoreObj.getSystems(3, member._id);
            let changeRunSystems = this.props.scoreObj.getSystems(2, member._id);
            let runSystems = leadSystems.concat(deputySystems).concat(changeRunSystems).concat(this.props.scoreObj.getSystems(1, member._id));

            return (
                <div key={combinedId} id={combinedId} className="modal fade" role="dialog">

                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">{member.name} {member.surname}</h4>
                            </div>
                            <div className="modal-body">
                                <h4>Change The Bank</h4>
                                {leadSystems.length > 0 && <div>
                                    <p>Take a leading role in changing the bank with regards to {this._readableArray(leadSystems)}
                                        &nbsp;and all underlying systems and components.</p>
                                </div>}
                                <h4>Run The Bank</h4>
                                {runSystems.length > 0 && <div>
                                    <p>Be involved in the weekly rotation system as a Scitman in running the bank and supporting the {this._readableArray(runSystems)}
                                        &nbsp;and all underlying systems and components.</p>
                                </div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    _renderTableCharts(team) {
        let filteredSystems = this.props.systemObj.systems.filter(system => system.teamId == team._id);
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
        let filteredSystems = this.props.systemObj.systems.filter(system => system.teamId == team._id);
        let width = String(100 / filteredSystems.length) + '%';

        return filteredSystems.map((system) => {
            let combinedId = system._id + '.' + member._id;
            let scoreValue = this.props.scoreObj.getScore(system._id, member._id);

            let style = {
                width: '100%'
            };

            let attr = [];
            attr.push('btn');
            attr.push('dropdown-toggle');
            attr.push('btn-block');

            switch (scoreValue) {
                case 4:
                case 3:
                    attr.push('btn-warning');
                    break;
                case 2:
                case 1:
                    attr.push('btn-info');
                    break;
                default:
                    attr.push('btn-default');
            }

            return (
                <td width={width} key={combinedId}>
                    {/* <input type='number' min='0' max='4' id={combinedId} value={scoreValue} onChange={this._scoreUpdate.bind(this)} style={style} disabled={this.state.lockEdit}/> */}

                    <div className="dropdown">
                        <button className={cx(...attr)} type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this._scoreToLabel(scoreValue)}&nbsp;<span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
                            <li>
                                <a id={combinedId} onClick={this._scoreUpdate.bind(this)} href="#">{this._scoreToLabel(4)}</a>
                            </li>
                            <li>
                                <a id={combinedId} onClick={this._scoreUpdate.bind(this)} href="#">{this._scoreToLabel(3)}</a>
                            </li>
                            <li>
                                <a id={combinedId} onClick={this._scoreUpdate.bind(this)} href="#">{this._scoreToLabel(2)}</a>
                            </li>
                            <li>
                                <a id={combinedId} onClick={this._scoreUpdate.bind(this)} href="#">{this._scoreToLabel(1)}</a>
                            </li>
                            <li>
                                <a id={combinedId} onClick={this._scoreUpdate.bind(this)} href="#">{this._scoreToLabel(0)}</a>
                            </li>
                        </ul>
                    </div>
                </td>
            );
        });
    }

    //used for input to avoid react warnings with callbacks
    _scoreUpdate(event) {
        let score = this._labelToScore(event.target.text)

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

    _labelToScore(score) {
        switch (score) {
            case 'Lead':
                return 4;
            case 'Deputy':
                return 3;
            case 'Change/Run':
                return 2;
            case 'Run':
                return 1;
        }
        return 0;
    }

    _scoreToLabel(score) {
        switch (score) {
            case 4:
                return 'Lead';
            case 3:
                return 'Deputy';
            case 2:
                return 'Change/Run';
            case 1:
                return 'Run';
        }
        return 'None';
    }

    componentDidUpdate() {
        $("span.pie").peity("pie", {
            radius: 40,
            // fill: function(_, i, all) {
            //     var hue = parseInt(i * (360 / all.length));
            //     return "hsl(" + hue + ",100%,50%)"
            // }
            fill: [
                "rgb(255, 0, 0)",
                "rgb(0, 255, 0)",
                "rgb(0, 0, 255)",
                "rgb(255, 255, 0)",
                "rgb(255, 0, 255)",
                "rgb(0, 255, 255)",
                "rgb(127, 0, 0)",
                "rgb(0, 127, 0)",
                "rgb(0, 0, 127)"
            ]
        });
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
    constructor(scores, systemObj) {
        this.systemObj = systemObj;
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

    getSystems(scoreMatch, memberId) {
        var systemObj = this.systemObj;
        let systems = []
        if (this.scoreMap.get(memberId)) {
            this.scoreMap.get(memberId).forEach(function(score, systemId) {
                if (systemObj.getSystem(systemId) && scoreMatch == score) {
                    systems.push(systemObj.getSystem(systemId));
                }
            });
        }
        return systems;
    }
}

class SystemObj {
    constructor(systems) {
        this.systems = systems;
        this.systemMap = new Map();

        systems.map((system) => {
            this.systemMap.set(system._id, system);
        });
    }

    getSystem(systemId) {
        return this.systemMap.get(systemId);
    }
}

export default createContainer(() => {
    Meteor.subscribe('members');
    Meteor.subscribe('systems');
    Meteor.subscribe('scores');
    Meteor.subscribe('teams');

    let systemObj = new SystemObj(SystemCollection.find({}, {
        sort: {
            label: 1
        }
    }).fetch());

    let scoreObj = new ScoreObj(ScoreCollection.find({}).fetch(), systemObj);

    return {scoreObj: scoreObj, systemObj: systemObj, members: MemberCollection.find({}, {
            sort: {
                name: 1
            }
        }).fetch(), teams: TeamCollection.find({}, {
            sort: {
                label: 1
            }
        }).fetch()};
}, Matrix);

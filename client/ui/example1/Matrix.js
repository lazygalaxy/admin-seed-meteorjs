//react
import React from 'react';

//meteor
import {createContainer} from 'meteor/react-meteor-data';

//react components
import Page from '../Page';

//collections
import {MemberCollection} from '../../../imports/api/collections';
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
                <div key={team._id}>
                    <h2>{team.label}</h2>
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
                    <td>1</td>
                    <td>
                        <span className="line">5,3,2,-1,-3,-2,2,3,5,2</span>
                    </td>
                    <td>{member.name}</td>
                    <td className="text-navy">
                        <i className="fa fa-level-up"></i>
                        40%
                    </td>
                </tr>
            );
        });
    }

    render() {
        return (
            <Page title='Matrix'>
                <div className="ibox float-e-margins">
                    <div className="ibox-title">
                        <h5>Striped Table</h5>
                    </div>
                    <div className="ibox-content">
                        {this._renderTables()}
                    </div>
                </div>
            </Page>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('systems');
    Meteor.subscribe('members');
    Meteor.subscribe('teams');

    return {systems: SystemCollection.find({}, {
            sort: {
                label: 1
            }
        }).fetch(), members: MemberCollection.find({}, {
            sort: {
                name: 1
            }
        }).fetch(), teams: TeamCollection.find({}, {
            sort: {
                label: 1
            }
        }).fetch()};
}, Matrix);

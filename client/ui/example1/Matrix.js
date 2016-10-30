import React from 'react';
import Page from '../Page';

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

export default React.createClass({
    render() {
        return (
            <Page title='Matrix'>
                <div className="ibox float-e-margins">
                    <div className="ibox-title">
                        <h5>Striped Table</h5>
                    </div>
                    <div className="ibox-content">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Data</th>
                                    <th>User</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <span className="line">5,3,2,-1,-3,-2,2,3,5,2</span>
                                    </td>
                                    <td>Samantha</td>
                                    <td className="text-navy">
                                        <i className="fa fa-level-up"></i>
                                        40%
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>
                                        <span className="line">5,3,9,6,5,9,7,3,5,2</span>
                                    </td>
                                    <td>Jacob</td>
                                    <td className="text-warning">
                                        <i className="fa fa-level-down"></i>
                                        -20%
                                    </td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>
                                        <span className="line">1,6,3,9,5,9,5,3,9,6,4</span>
                                    </td>
                                    <td>Damien</td>
                                    <td className="text-navy">
                                        <i className="fa fa-level-up"></i>
                                        26%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Page>
        )
    }
})

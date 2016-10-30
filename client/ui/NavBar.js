import React from 'react'

export default class NavBar extends React.Component {
    render() {
        const navStyle = {
            'marginBottom': 0
        };

        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top" role="navigation" style={navStyle}>
                    <div className="navbar-header">
                        <a id="navbar-minimalize" className="minimalize-styl-2 btn btn-primary " href="#">
                            <i className="fa fa-bars"></i>
                        </a>
                        <form role="search" className="navbar-form-custom" action="search_results">
                            <div className="form-group">
                                <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search"/>
                            </div>
                        </form>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <a href="#">
                                <i className="fa fa-sign-out"></i>
                                Log out
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

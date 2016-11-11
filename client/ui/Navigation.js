import React from 'react'
import Accounts from './Accounts.js';

export default class Navigation extends React.Component {
    render() {
        return (
            <nav className="navbar-default navbar-static-side" role="navigation">
                <div className="sidebar-collapse">

                    {/* Close canvas menu used only on OffCanvas page
              You can remove this tag if you dont use offCanvas menu */}
                    <a className="close-canvas-menu">
                        <i className="fa fa-times"></i>
                    </a>

                    <ul className="nav" id="side-menu">
                        <li className="nav-header">
                            <Accounts/>
                        </li>
                        {this.props.children}
                    </ul>
                </div>
            </nav>
        )
    }
}

import React from 'react'

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
                            <div className="dropdown profile-element">
                                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                    <span className="clear">
                                        <span className="block m-t-xs">
                                            <strong className="font-bold">Example user</strong>
                                        </span>
                                        <span className="text-muted text-xs block">user
                                            <b className="caret"></b>
                                        </span>
                                    </span>
                                </a>
                                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                    <li>
                                        <a href="#">Item</a>
                                    </li>
                                    <li>
                                        <a href="#">Item</a>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a href="#">Item</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="logo-element">
                                IN+
                            </div>
                        </li>
                        {this.props.children}
                    </ul>
                </div>
            </nav>
        )
    }
}

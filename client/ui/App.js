import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
    render() {
        return (
            <div id="wrapper">
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
                            <li>
                                <NavLink to="/" onlyActiveOnIndex>
                                    <i className="fa fa-dashboard"></i>
                                    <span className="nav-label">Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">
                                    <i className="fa fa-dashboard"></i>
                                    <span className="nav-label">About</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/repos">
                                    <i className="fa fa-diamond"></i>
                                    <span className="nav-label">Repos</span>
                                </NavLink>
                            </li>
                        </ul>

                    </div>
                </nav>

                <div id="page-wrapper" className="gray-bg">

                    {/* {{> topNavbar }} */}

                    {this.props.children}

                    <div className="footer">
                        <div className="pull-right">
                            10GB of
                            <strong>250GB</strong>
                            Free.
                        </div>
                        <div>
                            <strong>Copyright</strong>
                            Example Company &copy; 2014-2015
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

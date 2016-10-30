import React from 'react'
import Navigation from '../Navigation'
import NavLink from '../NavLink'
import NavBar from '../NavBar'
import Footer from '../Footer'

export default React.createClass({
    render() {
        return (
            <div id="wrapper">
                <Navigation>
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
                </Navigation>

                <div id="page-wrapper" className="gray-bg">
                    <NavBar></NavBar>
                    {this.props.children}
                    <Footer></Footer>
                </div>
            </div>
        )
    }
})

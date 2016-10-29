import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
    render() {
        return (
            <div id="wrapper">
                {/* {{> navigation }} */}

                <ul role="nav">
                    <li>
                        <NavLink to="/" onlyActiveOnIndex>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/repos">Repos</NavLink>
                    </li>
                </ul>

                <div id="page-wrapper" className="gray-bg">

                    {/* {{> topNavbar }} */}

                    {this.props.children}

                    {/* {{> footer }} */}

                </div>

            </div>
        )
    }
})

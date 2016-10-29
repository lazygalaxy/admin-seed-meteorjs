import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    handleSubmit(event) {
        event.preventDefault()
        const userName = event.target.elements[0].value
        const repo = event.target.elements[1].value
        const path = `/repos/${userName}/${repo}`
        this.context.router.push(path)
    },

    render() {
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-12">
                        <h2>Repos</h2>
                    </div>
                </div>

                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center m-t-lg">
                                <ul>
                                    <li>
                                        <NavLink to="/repos/reactjs/react-router">React Router</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/repos/facebook/react">React</NavLink>
                                    </li>
                                    <li>
                                        <form onSubmit={this.handleSubmit}>
                                            <input type="text" placeholder="userName"/>
                                            / {' '}
                                            <input type="text" placeholder="repo"/>{' '}
                                            <button type="submit">Go</button>
                                        </form>
                                    </li>
                                </ul>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

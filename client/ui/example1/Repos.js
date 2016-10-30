import React from 'react'
import Page from '../Page';
import NavLink from '../NavLink'

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
            <Page title='Repos'>
                <div>
                    <NavLink to="/repos/reactjs/react-router">React Router</NavLink>
                </div>
                <div>
                    <NavLink to="/repos/facebook/react">React</NavLink>
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="userName"/>
                        / {' '}
                        <input type="text" placeholder="repo"/>{' '}
                        <button type="submit">Go</button>
                    </form>
                </div>
                {this.props.children}
            </Page>
        )
    }
})

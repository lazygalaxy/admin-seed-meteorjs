import React from 'react';
import Page from '../Page';

export default React.createClass({
    render() {
        return (
            <Page title='About'>
                <h1>
                    Welcome to the LazyGalaxy admin seed project.
                </h1>
                <small>
                    Based on Meteor and React.
                </small>
            </Page>
        )
    }
})

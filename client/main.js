//import react libs
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'

//import recipe components
import App from './ui/App';
import Home from './ui/Home';
import About from './ui/About';
import Repo from './ui/Repo';
import Repos from './ui/Repos';

Meteor.startup(() => {
    render((
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/repos" component={Repos}>
                    <Route path="/repos/:userName/:repoName" component={Repo}/>
                </Route>
            </Route>
        </Router>
    ), document.getElementById('render-target'));
});

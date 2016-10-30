//import react libs
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'

//import recipe components
import App from './ui/example1/App';
import Home from './ui/example1/Home';
import About from './ui/example1/About';
import Repo from './ui/example1/Repo';
import Repos from './ui/example1/Repos';
import Matrix from './ui/example1/Matrix';

Meteor.startup(() => {
    render((
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/repos" component={Repos}>
                    <Route path="/repos/:userName/:repoName" component={Repo}/>
                </Route>
                <Route path="/matrix" component={Matrix}/>
            </Route>
        </Router>
    ), document.getElementById('render-target'));
});

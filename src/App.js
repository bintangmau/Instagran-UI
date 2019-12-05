import React from 'react';
import './App.css';
import { Switch, Route, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { keepLogin } from './redux/actions/userAction'

import Navbar from './components/Navbar'
import MainPage from './components/MainPage'
import ExplorePage from './components/ExplorePage'
import ProfilePage from './components/ProfilePage'
import Auth from './components/Auth'

class App extends React.Component {
  componentDidMount() {
    var keepLogin = localStorage.getItem('data')
    this.props.keepLogin(keepLogin)
  }
  
render() {
    return (
    <div>
      <Navbar />
      <Switch>
        <Route path='/' component={MainPage} exact />
        <Route path='/explore' component={ExplorePage} exact />
        <Route path='/profile/:id' component={ProfilePage} exact />
        <Route path='/auth' component={Auth} exact />
      </Switch>
    </div>
    );
  }
}


export default connect(null, { keepLogin })(withRouter(App));

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
import DetailsPhoto from './components/DetailsPhoto'
import OtherProfilePage from './components/OtherProfilePage'
import OtherDetailsPhoto from './components/OtherDetailsPhoto'

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
        <Route path='/detailsphoto/:id' component={DetailsPhoto} exact/>
        <Route path='/otherprofilepage/:id' component={OtherProfilePage} exact />
        <Route path='/otherdetailsphoto/:id' component={OtherDetailsPhoto} exact />
      </Switch>
    </div>
    );
  }
}


export default connect(null, { keepLogin })(withRouter(App));

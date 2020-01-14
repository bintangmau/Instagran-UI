import React from 'react';
import './App.css';
import { Switch, Route, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { keepLogin } from './redux/actions/userAction'

import Navbar from './components/navbar/Navbar'
import MainPage from './pages/home/MainPage'
import ExplorePage from './pages/explore/ExplorePage'
import ProfilePage from './pages/profile/ProfilePage'
import Auth from './components/auth/Auth'
import DetailsPhoto from './pages/detailsphoto/DetailsPhoto'
import OtherProfilePage from './pages/otherprofilepage/OtherProfilePage'
import OtherDetailsPhoto from './pages/otherdetailsphoto/OtherDetailsPhoto'
import Notification from './pages/notification/Notification' 
import EditProfile from './pages/editprofile/EditProfile'

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
        <Route path='/notification' component={Notification} exact />
        <Route path='/editprofile' component={EditProfile} exact />
      </Switch>
    </div>
    );
  }
}


export default connect(null, { keepLogin })(withRouter(App));

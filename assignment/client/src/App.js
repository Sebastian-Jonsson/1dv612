import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import Home from './components/home'
import Dashboard from './components/dashboard'
import Notifications from './components/notifications'
import Settings from './components/settings'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    axios.get('/api/v1/users/isLoggedIn').then(resp => {
          setIsLoggedIn(resp.data)
          if(resp.data.userSocket) {
            setUserId(resp.data.userSocket)
          }
        }
      )
    }, []
  )
  
  return (
    <Router>
      <div className='App'>
        <Header isAuth={isLoggedIn}/>
          {
            isLoggedIn
            ?
            <Switch>
            <Route path='/dashboard' render={(props) => (
              <Dashboard {...props} userId={userId}/>
            )}/>
            <Route path='/notifications' component={Notifications} />
            <Route path='/settings' component={Settings} />
            </Switch>
            :
            <Switch>
            <Route path='/' exact component={Home} />
            </Switch>
          }
        <Footer />
      </div>
    </Router>
  );
}


export default App

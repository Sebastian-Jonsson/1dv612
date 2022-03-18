import React from "react"
import Icon from "../icons/notificationIcon.png"
import { Link } from "react-router-dom"


function Header(props) { 

  return (
    <header className="main-head">
      <nav>
        <div className="logo">
          <img src={Icon} alt="logo" />
          <h1>Gitlab Notifier alpha</h1>
        </div>
        
          { 
          props.isAuth
          ?
          <ul>
          <Link to="/dashboard">
            <li>
              Dashboard
            </li>
          </Link>
          <Link to="/notifications">
            <li>
              Notifications
            </li>
          </Link>
          <Link to="/settings">
            <li>
              Settings
            </li>
          </Link>
          </ul>
          :
          <ul>
          <Link to="/">
            <li>
              Log In
            </li>
          </Link>
          </ul>
          
          }
           
      </nav>
    </header>
  )
}

export default Header

import React from 'react';
import { GoogleLogout } from 'react-google-login';


function Student(props) {

  if (props.loggedIn) {
    var user = (
      <div className="user">
        <img src={props.imageUrl} alt={props.name} />
        <div className="dropdown">
          <ul>
            <li>{props.name}</li>
            <li>{props.email}</li>
            <li>
              <GoogleLogout
              className="logOut-btn"
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Logout"
                onLogoutSuccess={props.logout}
              >
              </GoogleLogout>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="wrapper">
      {user}

        <h1>Courses</h1>
      <div className="grid-container">
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
      </div>
    </div>
  )
}


export default Student
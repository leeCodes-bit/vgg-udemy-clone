import React from 'react';
import { GoogleLogout } from 'react-google-login';


function Tutor(props) {

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

        <div className="grid-container">
            <h4>Upload Courses</h4>
            <input type ="file"></input>
        </div>
    </div>
  )
}


export default Tutor
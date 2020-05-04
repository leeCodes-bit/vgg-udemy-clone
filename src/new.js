import React, { useState, useEffect, Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

function Tutor(props) {
  const [data, setData] = useState({});
  const [signedIn, setSignedIn] = useState(false);
  const [video, setVideo] = useState('');
  const [loading, setLoading] = useState(false);

const uploadVideo = async e => {
  const files = e.target.files;
  const data = new FormData();
  data.append('file', files[0]);
  
  data.append('upload_preset', 'lilian');
  setLoading(true);
  // const res = await fetch(
  //   '	https://api.cloudinary.com/v1_1/dzfz6iwon/image/upload', 
  //   {
  //     method: 'POST',
  //     body: data
  //   }
  // ) 
  // const file = await res.json();

  // setImage(file.secure_url);
  // setLoading(false);
  
  fetch('https://api.cloudinary.com/v1_1/dzfz6iwon/video/upload', {
      method: 'POST',
      body: data
  }).then(function(response){
    const file = response.json();
    setVideo(file.secure_url);
   setLoading(false);

   return file;
  })
  .then(function(data){
    console.log(data)
    const url = data.url;
    console.log(url);
  })
  
}

  useEffect(() => {
    /*
To access the data passed to <Redirect />
in home component, props.location.state is used.

I extracted the loggedIn and userData I passed
into their own variable.

I passes an empty array [] to this particular
useEffect because I want it to render just once
to prevent infinite loop
*/
    if (props.location.state) {
      const { loggedIn } = props.location.state;
      const { userData } = props.location.state;
      setData(userData);
      setSignedIn(loggedIn);
    }
    //passed the extracted data to states
  }, []);

  /* 
 second useEffect watches for changes in 
 signedIn and data state.
 
 It also checkes if the data passed
 to <Redirect />, if it is empty
 if empty, den student is not authenticated,
 take them back to home to sign in
 */
  useEffect(() => {
    if (!props.location.state) {
      props.history.push("/");
    }
  }, [signedIn, data]);

  //Google auth logout function
  const logout = () => {
    //state is updated back to default
    setData({});
    setSignedIn(false);

    /*
 clear previous data passe to
 <Redirect /> in Home component
 */
    props.location.state = null;

    //when loggedOut, take student back to home
    props.history.push("/");
  };

  //show user details when student is signedIn
  if (signedIn) {
    var user = (
      <div className="user">
        <img src={data.imageUrl} alt={props.name} />
        <div className="dropdown">
          <ul>
            <li>{data.name}</li>
            <li>{data.email}</li>
            <li>
              <GoogleLogout
                className="logOut-btn"
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Logout"
                onLogoutSuccess={logout}
              ></GoogleLogout>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="wrapper">
        {user}

        <div className="grid-container">
          <h4>Upload Courses</h4>
          <input 
            type="file"
            name ="file"
            placeholder="upload a video"
            onChange ={uploadVideo}
          />
          {loading ? (
            <h3>Loading...</h3>
          ): (
            <video>
              <source src= {video} type="video/mp4" />
            </video>
         
            )}        
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(Tutor);

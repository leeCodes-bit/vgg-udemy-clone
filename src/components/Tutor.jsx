import React, { useState, useEffect, Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import { jsonServer } from './jsonServer';
import Backdrop from './Backdrop';
import '../assets/css/Tutor.css';

function Tutor(props) {
  const [data, setData] = useState({});
  const [signedIn, setSignedIn] = useState(false);
  const [video, setVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoTitle , setVideoTitle] = useState(null);
  const [videoDesc , setVideoDesc] = useState(null);
  const [videoFile , setVideoFile] = useState(null);

const uploadVideo = (e) => {

  //prevent form default action
  e.preventDefault();

  const data = new FormData();
  data.append('file', videoFile);
  
  data.append('upload_preset', 'lilian');
  setLoading(true);
  
  fetch('https://api.cloudinary.com/v1_1/dzfz6iwon/video/upload', {
      method: 'POST',
      body: data
  }).then(function(response){
    const file = response.json();
    setVideo(file.secure_url);

   return file;
  })
  .then(function(data){
  
    const url = data.url;

    const videoDetails = {
      title: videoTitle,
      description: videoDesc,
      url: url
    }
    
    fetch(`${jsonServer}/videos` , {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(videoDetails)
    })
    .then(function(res){
      if(res.ok) {
      setLoading(false);

      const form = document.getElementById('form');

      form.reset();
      }
    })
    
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

  // useEffect(()=> {
   
  // }, [videoDesc,videoTitle,videoFile])


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

  const formData = (e) => {
  
    if(e.target.name === 'title') {
      setVideoTitle(e.target.value)
    }

    if(e.target.name === 'description') {
      setVideoDesc(e.target.value)
    }

    if(e.target.name === 'file') {
      setVideoFile(e.target.files[0])
    }
  }

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
    { loading ? 
    <Backdrop />
    : null }
      <div className="wrapper">
        {user}

        <div className="form-container">
          
          <form 
          onSubmit={uploadVideo} 
          id="form"
          className="form-data">
          <h3>Upload a Video</h3>
          <label 
          htmlFor="title">Title</label><br/>
          <input 
          required
          type="text" 
          onChange={formData} 
          name="title" 
          placeholder="Enter Title" /><br/>                   
          <label 
          htmlFor="description">Description</label><br/>
          <textarea
          required
           onChange={formData}
            placeholder="Enter description" 
            name="description"></textarea><br/>
          <input 
          type="file" 
          required 
          name ="file"
           placeholder="upload a video" 
           onChange ={formData}  /><br/>
          <button 
          className="btn"
           type="submit"
            style={{borderRadius: "10px", padding: "10px 50px", fontWeight: "bold", display: "inline-block"}}>Submit</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(Tutor);

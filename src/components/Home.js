import React, { useState, useEffect, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import '../assets/css/Home.css'

function Home() {

 const [userData, setData] = useState(null);
 const [loggedIn, setLoggedIn] = useState(false);
 const [routeToStudent, setRouteToStudent] = useState(false);
 const [routeToTutor, setRouteToTutor] = useState(false);

 useEffect(() => {

 }, [userData, loggedIn, routeToStudent])

 const studentSignIn = (response) => {
  if (response && !response.error) {
   setData(response.profileObj);
   setLoggedIn(true);
   setRouteToStudent(true)
  }

 };

 const tutorSignIn = (response) => {
  if (response && !response.error) {
   setData(response.profileObj);
   setLoggedIn(true);
   setRouteToTutor(true)
  }

 };

 return (
  <Fragment>
   {/* 
   Redirect routes to student or tutors page
   I used two states(routeToStudent & routeToTutor)
    to control the page i am routing to
   depending on the button clicked

    To be able to use the data retrieved
    from google, I passed the data to <Redirect />
    state
   */}
   {
    loggedIn && userData && routeToStudent ?
     <Redirect to={{
      pathname: "/student",
      state: {
       loggedIn: loggedIn,
       userData
      }
     }} />
     :
     null
   }
   {
    loggedIn && userData && routeToTutor ?
     <Redirect to={{
      pathname: "/tutor",
      state: {
       loggedIn: loggedIn,
       userData
      }
     }} />
     :
     null
   }
    <div className="homepage">
    <div className="home-container">
     <div className="home-body"></div>
     <h2 style={{ color: "#fff", marginTop: "-25px", paddingTop: "250px" }}> Welcome to your VGG-Udemy-Clone </h2>
     {!loggedIn ?
      <GoogleLogin className="login"
       clientId="766428043466-ifj8386gd3p01nlc3p7pc1t14uvvti2j.apps.googleusercontent.com"
       buttonText="Signup as a Student"
       onSuccess={studentSignIn}
       onFailure={studentSignIn}
       cookiePolicy={'single_host_origin'} />
      : null
     }
     {!loggedIn ?
      <GoogleLogin className="login"
       clientId="766428043466-ifj8386gd3p01nlc3p7pc1t14uvvti2j.apps.googleusercontent.com"
       buttonText="Signup as a Tutor"
       onSuccess={tutorSignIn}
       onFailure={tutorSignIn}
       cookiePolicy={'single_host_origin'} />
      : null
     }
    </div>
   </div>
  </Fragment>
 )
}


export default Home;
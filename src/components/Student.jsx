import React, { useState, useEffect, Fragment } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { jsonServer } from "./jsonServer";

function Student(props) {
  const [data, setData] = useState({});
  const [signedIn, setSignedIn] = useState(false);
  const [allCourses, setallCourses] = useState(null);
  const [favouriteCourses, setFavouriteCourses] = useState([]);
  const [toggleFavourite, setToggleFavourite] = useState(null);

  useEffect(() => {
    if (props.location.state) {
      const { loggedIn } = props.location.state;
      const { userData } = props.location.state;
      setData(userData);
      setSignedIn(loggedIn);

      //clear props.location.state
      props.history.replace({
        ...props.location,
        state: undefined
      })

    }

  }, []);

  useEffect(() => {

    //take student back to home if props.location.state is empty
    if (!props.location.state) {
      props.history.push("/");
    }
  }, []);


  useEffect(() => {

    /* fetch all courses if user is 
    signed in
    */
    if (signedIn) {
      fetch(`${jsonServer}/videos`, {
        method: "GET",
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          setallCourses(data)
        })
    }

  }, [signedIn])


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
    if (signedIn) {

      fetch(`${jsonServer}/students?id=${data.email}`, {
        method: "GET",
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {

          //save first time users to json-server
          if (res.length === 0) {

            const userData = {
              id: data.email,
              favourite: []
            };

            fetch(`${jsonServer}/students`, {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json"
              }),
              body: JSON.stringify(userData)
            });

          }

        });
    }

  }, [signedIn]);


  useEffect(()=> {
    if(signedIn){
      
     fetch(`${jsonServer}/students?id=${data.email}`, {
      method: "GET"
    }).then(function(res){
      return res.json();
    }).then(function(res){
         const userFavourite = res[0].favourite;
         setFavouriteCourses(userFavourite);
         setToggleFavourite(false);
    })
    }
  }, [toggleFavourite,favouriteCourses])


  //Google auth logout function
  const logout = () => {
    //state is updated back to default
    setData({});
    setSignedIn(false);

    /*
   clear previous data passe to
   <Redirect /> in Home component
   */
    props.history.replace({
      ...props.location,
      state: undefined
    })

    //when loggedOut, take student back to home
    props.history.push("/");
  };

  const favourite = (e) => {
     const target = e.target;

     const title = target.getAttribute("data-title");
     const description = target.getAttribute("data-description");
     const url = target.getAttribute("data-url");


     fetch(`${jsonServer}/students?id=${data.email}`, {
       method: "GET"
     }).then(function(res){
       return res.json();
     }).then(function(res){
          const userFavourite = res[0].favourite;
          
          userFavourite.push({
            title: title,
            description: description,
            url: url
          });
       
     fetch(`${jsonServer}/students/${data.email}`, {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({favourite : userFavourite})
    }).then(function(res){
      if(res.ok){
        setToggleFavourite(true)
      }
    })


     })

  }

  const removeFavouriteCourse = (e) => {

    let target = e.target;
    let id = target.id;

          
    fetch(`${jsonServer}/students?id=${data.email}`, {
      method: "GET"
    }).then(function(res){
      return res.json();
    }).then(function(res){
         const userFavourite = res[0].favourite;
       
         const filter = userFavourite.filter(function (value) {
          return value.id !== id;
         });

         console.log(filter)
                
     fetch(`${jsonServer}/students/${data.email}`, {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({favourite : filter})
    })
    .then((response) => {
      if (response.ok) {
       //remove element from the dom
       target.parentElement.parentElement.remove();
      }
     })
    })

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

  if (allCourses && allCourses.length) {
    var courses = allCourses.map(function (value, index) {
      return (
        <Fragment key={index}>
          <div className="grid-item">
            <video width="400" controls>
              <source src={value.url} type="video/mp4" />
      Your browser does not support HTML5 video.
     </video>
            <div className="course-body">
              <h4 className="course-title">{value.title}</h4>
              <p className="course-about">{value.description}</p>
            </div>
            <div className="grid-footer">
              <p 
              onClick={favourite}
              data-title={value.title} 
              data-description={value.description}
              data-url={value.url}>Add To Favourite</p>
            </div>
          </div>
        </Fragment>

      );
    })
  }

  if(favouriteCourses) {
    var favCourses = favouriteCourses.map(function (value, index) {
      return (
        <Fragment key={index}>
          <div className="grid-item">
            <video width="400" controls>
              <source src={value.url} type="video/mp4" />
      Your browser does not support HTML5 video.
     </video>
            <div className="course-body">
              <h4 className="course-title">{value.title}</h4>
              <p className="course-about">{value.description}</p>
            </div>
            <div className="grid-footer">
              <p
              onClick={removeFavouriteCourse}
              id={value.url}>Remove From Favourite
              </p>
            </div>
          </div>
        </Fragment>
      )
      })
  }

  return (
    <Fragment>
      <div className="wrapper">
        {user}
        <div className="wrapper-container">
        <div>
        <h3>Favourite</h3>
        <div className="grid-container">
          {favCourses}
        </div>
        </div>
        
        <div>
        <h3>Courses</h3>
        <div className="grid-container">
          {courses}
        </div>
        </div>
        </div>
      </div>
    </Fragment>
  );
}

/* 
 sometimes, you won't be able to  access
 react-router methods, because the component
 is not inheriting it. If such case arises,
 withRouter is used to make react-router 
 features available to the component
 */
export default withRouter(Student);

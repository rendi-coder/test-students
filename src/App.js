import React,{useEffect} from 'react';
import './App.css';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import NavBar from './Components/Header/Navbar'
import Tests from './Components/Tests/Tests'
import Test from './Components/Tests/Test'
import AddTest from './Components/AddTest/addTest'
import Auth from './Components/Auth/Auth'
import {autoLogin} from "./redux/authReducer";
import {connect} from "react-redux"
import Logout from './Components/Auth/Logout';
import 'materialize-css'

function App(props) {

  useEffect(()=>{
    props.autoLogin();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  let routes=(
    <Switch>
    <Route path="/" exact render={()=><Tests/>} />
    <Route path="/auth" render={()=><Auth/>} />
    <Redirect to='/'/>
    </Switch>
  )

  if(props.isAuth){
    routes=(
      <Switch>
         <Route path="/"  exact render={()=><Tests/>} />
         <Route path="/test/:id" exact render={()=><Test auth={props.login}/>} />
          <Route path="/addTest" exact render={()=><AddTest/>} />
          <Route path="/logout" exact render={()=><Logout />} />
          <Redirect to='/'/>
    </Switch>
      )
    }

  return(
  <BrowserRouter >
    <NavBar auth={props.isAuth} />
    <Switch>
        {routes}
    </Switch>
  </BrowserRouter >
  )
}

const mapStateToProps=(state)=>{
  return{
    isAuth:!!state.auth.token,
    login:state.auth.login
  }
}

export default connect(mapStateToProps,{autoLogin}) (App);

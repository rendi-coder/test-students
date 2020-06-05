import React from 'react';
import {NavLink} from 'react-router-dom'
import { connect } from 'react-redux';

const NavBar = (props)=>{

   return( <nav>
    <div className="nav-wrapper blue darken-1" style={{padding:'0 2rem'}}>
    <span className="brand-logo">Тестирование</span>
    <ul id="nav-mobile" className="right hide-on-med-and-down">
       
        {props.auth?<>
        <li><NavLink to="/">Список Тестов</NavLink></li>
        {props.login==="admin@gmail.com"&&
        <li><NavLink to="/addTest">Добавить Тест</NavLink></li>}
        <li><NavLink to="/logout">Выйти</NavLink></li></>
        :<><li><NavLink to="/">Главная</NavLink></li>
        <li><NavLink to="/auth">Авторизация</NavLink></li></>
        }
    </ul>
    </div>
    </nav>
   )
}

const mapStateToProps=(state)=>{
    return{
        login:state.auth.login
    }
}

export default connect(mapStateToProps,null)(NavBar)
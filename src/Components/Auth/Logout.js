import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {logout,clearGroupFio} from '../../redux/authReducer'



class Logout extends Component{
    componentDidMount(){
        this.props.logout()
        this.props.clearGroupFio()
    }

    render() {
        return<Redirect to={"/"} />
        }
 }

 

export default connect(null,{logout,clearGroupFio}) (Logout)
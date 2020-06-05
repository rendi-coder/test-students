import React from 'react';
import {connect} from 'react-redux'
import {getTests} from '../../redux/ListTestsReducer'
import classes from './Test.module.css'
import { NavLink } from 'react-router-dom'
import Loader from '../../UI/Loader/Loader'

class Test extends React.Component{
    
    componentDidMount(){
        this.props.getTests()
    }
   
    render(){
        if(this.props.loading)return <Loader />
    return(
        <div className="container">
            {this.props.login&&<h4>Login:{this.props.login}</h4>}
            <h1>Список тестов</h1>
            {this.props.tests.length===0&&<h6>Новых тестов пока нет...Черенков добавит)</h6>}
            <ul>
                {this.props.tests&&
                this.props.tests.map((t,i)=>{
                if(this.props.login){
                return <li className={classes.test} key={t.id}>{i+1}.<NavLink to={'/test/'+t.id}>{t.titleTest}</NavLink></li>}
                else{return<li onClick={()=>window.M.toast({html:"Для прохождения теста нужно зарегистрироваться"})} className={classes.test} key={t.id}>{i+1}.{t.titleTest}</li>}
                })
                }
            </ul>
            {this.props.completedTest.length>0&&<div>
                <h2 style={{color:"red"}}>Список Пройденных тестов</h2>
                    <ul>
                        {this.props.completedTest
                        .map((t,i)=>{
                        return <li className={classes.test} key={i}>{i+1}.{t.titleTest}</li>
                        })
                        }
                    </ul>
         </div>}
        </div>
    )
    }
}

const mapStateToProps=(state)=>{
    return{
        tests:state.listTests.tests,
        login:state.auth.login,
        completedTest:state.listTests.completedTest,
        loading:state.listTests.loading,
    }
}

export default connect(mapStateToProps,{getTests})(Test)
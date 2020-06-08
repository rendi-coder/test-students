import React from 'react'
import {getTestById,completedTest,setLoading,getTestStudentById} from '../../redux//ListTestsReducer'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import classes from './Test.module.css'
import Loader from '../../UI/Loader/Loader'

class Test extends React.Component{

    state={
        question1:'',
        question2:'',
        question3:'',
        question4:'',
        question5:'',
    }

    componentDidMount(){
        const id=window.location.pathname.split('/').reverse()[0]
        window.M.updateTextFields()
        if(this.props.auth==="admin@gmail.com"){
            this.props.getTestStudentById(id);
        }
        else{
            this.props.getTestById(id);
        }
    }

    onChangeTrueAnswer(e){
        const name = e.target.name
        let question = this.state[name]
        question = e.target.value
        this.setState({[name]:question})
    }
    
    onSubmit(e){
        e.preventDefault()
          if(+this.state.question1>0&&+this.state.question2>0&&+this.state.question3>0&&+this.state.question4>0&&+this.state.question5>0){
          const state=[]; const cstate=this.state;
            for (const key in cstate) {
               state.push(cstate[key])
            }
          this.props.completedTest(state);
          }else{
              window.M.toast({html:"Так дело не пойдет! Укажи ответы на все вопросы коль начал сынок!"})
          }
    }

    render(){
        if(this.props.loading==='redirect'){window.M.toast({html:"Тест пройден твои результаты сохраненны!"});this.props.setLoading(false); return <Redirect to='/' />}
        if(this.props.loading){return <Loader />}
        if(this.props.auth==="admin@gmail.com"){
            return <div className="container" style={{marginTop:'3rem'}}>
               <h3>Список здавших тест по <span style={{color:'green'}}>{this.props.nameTest}</span></h3>
               <hr></hr>
               <table>
                <thead>
                    <tr>
                        <td>№</td>
                        <td>Почта</td>
                        <td>ФИО</td>
                        <td>Группа</td>
                        <td>Бал</td>
                    </tr>
                </thead>
                <tbody>
                {this.props.adminPanel.length>0 ? this.props.adminPanel
                .map((e,i)=>{
                  return <tr key={i}>
                        <td>{i+1}.</td>
                        <td>{e.student.login}</td>
                        <td>{e.student.fio}</td> 
                        <td>{e.student.group}</td>
                        <td>{e.rating}</td>
                    </tr>
                }):null}
                </tbody>
                </table>
                
              
                </div>
        }
        //end admin
        return(
            <div className="container" style={{marginBottom:'3rem'}}>
                <h1>Тестирование: {this.props.currentTest.titleTest}</h1>
                <form onSubmit={(e)=>this.onSubmit(e)}>
                {this.props.currentTest.test && this.props.currentTest.test.map((q,i)=>{
                return(
                <div key={i} className="row" style={{cursor:'pointer', border:'1px solid gray',padding:'10px'}}>
                    <h4>{i+1}. Вопрос: {q.title}?</h4>
                    <hr></hr>
                    <h5>Выбирите ответ на вопрос</h5>
                    <div className="row">

                        <div className="input-field col s12">
                        <textarea value={q.first} id={'textarea1'+i} className="materialize-textarea" readOnly></textarea>
                        <span className="helper-text" >Ответ 1</span>
                        </div>

                        <div className="input-field col s12">
                        <textarea value={q.second}  id={'textarea2'+i} className="materialize-textarea" readOnly></textarea>
                        <span className="helper-text" >Ответ 2</span>
                        </div>

                        <div className="input-field col s12">
                        <textarea value={q.third} id={'textarea3'+i} className="materialize-textarea" readOnly></textarea>
                        <span className="helper-text" >Ответ 3</span>
                        </div>

                        <div className="input-field col s12">
                            <select onChange={e=>this.onChangeTrueAnswer(e)} name={"question"+(i+1)} className={"browser-default "+classes.selectI}>
                            <option value="0">Выбери ответ на вопрос</option>
                            <option value="1">Правильный ответ 1</option>
                            <option value="2">Правильный ответ 2</option>
                            <option value="3">Правильный ответ 3</option>
                            </select>
                        </div>

                    </div>
                </div>
                )
            })}
           <button type="submit" className="btn btn-primary">Ответить на тест</button>
           </form>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        currentTest:state.listTests.currentTest,
        loading:state.listTests.loading,
        adminPanel:state.listTests.adminPanel,
        nameTest:state.listTests.nameTest
    }
}

export default connect(mapStateToProps,{getTestStudentById,getTestById,completedTest,setLoading})(Test)
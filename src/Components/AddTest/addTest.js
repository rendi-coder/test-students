import React from 'react'
import {connect} from 'react-redux'
import {addToBD} from '../../redux/addTestReducer'
import { Redirect } from 'react-router-dom'

const question=[1,2,3,4,5]

class MyaddTest extends React.Component{


    state={
        titleTest:'',
        question1:{title:'',first:'',second:'',third:'',answer:''},
        question2:{title:'',first:'',second:'',third:'',answer:''},
        question3:{title:'',first:'',second:'',third:'',answer:''},
        question4:{title:'',first:'',second:'',third:'',answer:''},
        question5:{title:'',first:'',second:'',third:'',answer:''},
    }

    componentDidMount() {
        window.M.updateTextFields()
          this.myRef = React.createRef();
      }

      onChangeQuestionTitle(e){
        const name = e.target.name
        const copyQuestion = this.state[name]
        copyQuestion.title = e.target.value
        this.setState({[name]:copyQuestion})
      }

      onChangeQuestionAnswer(e){
        const target = e.target.name.split('.')
        const name = target[0]; const numberAnswer=target[1];
        const copyQuestion = this.state[name]
        if(numberAnswer==='first'){
            copyQuestion.first=e.target.value
        }else if(numberAnswer==='second'){
            copyQuestion.second=e.target.value
        }else if(numberAnswer==='third'){
            copyQuestion.third=e.target.value
        }
        this.setState({[name]:copyQuestion})
      }

      onChangeTrueAnswer(e){
        const name = e.target.name
        const copyQuestion = this.state[name]
        copyQuestion.answer = e.target.value
        this.setState({[name]:copyQuestion})
    }

      onSubmit(e){
          e.preventDefault()
            if(+this.state.question1.answer>0&&+this.state.question2.answer>0&&+this.state.question3.answer>0&&+this.state.question4.answer>0&&+this.state.question5.answer>0){
            const copyState= this.state
            this.props.addToBD(copyState)   
            }else{
                window.M.toast({html:"Выбирите ответы на все вопросы"})
            }
      }

    render(){
        if(this.props.pause==='redirect'){return <Redirect to="/" />}
        if(this.props.pause){return <div>Loading...</div>}
        return(<div className="container" style={{marginTop:'2rem'}}>
                <form onSubmit={(e)=>{this.onSubmit(e)}}>
                <h4>Введи названия теста который хотите добавить</h4>
                <div className="input-field col s6">
                    <input onChange={(e)=>this.setState({titleTest:e.target.value})} value={this.state.title} placeholder="" id="first_name" type="text" className="validate" required/>
                    <label htmlFor="first_name">имя теста</label>
                </div>  
            {question.map(q=>{
                return(
                <div key={q} className="row" style={{border:'1px solid gray',padding:'10px'}}>
                    <h4>Вопрос №{q}</h4>
                    <div className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                        <textarea name={`question${q}`} onChange={e=>this.onChangeQuestionTitle(e)} value={this.state[`question${q}`].title} id={'question'+q} className="materialize-textarea" required></textarea>
                        <label  htmlFor="textarea1">Введите вопрос</label>
                        </div>
                    </div>
                    </div>
                    <h5>Введите ответы на вопрос</h5>
                    <div className="row">

                        <div className="input-field col s12">
                        <textarea onChange={e=>this.onChangeQuestionAnswer(e)} value={this.state[`question${q}`].first} name={`question${q}.first`} id={'textarea1'+q} className="materialize-textarea"  required></textarea>
                        <label htmlFor={'textarea1'+q}>1 ответ</label>
                        </div>

                        <div className="input-field col s12">
                        <textarea onChange={e=>this.onChangeQuestionAnswer(e)} value={this.state[`question${q}`].second} name={`question${q}.second`} id={'textarea2'+q} className="materialize-textarea"  required></textarea>
                        <label  htmlFor={'textarea2'+q}>2 ответ</label>
                        </div>

                        <div className="input-field col s12">
                        <textarea onChange={e=>this.onChangeQuestionAnswer(e)} value={this.state[`question${q}`].third} name={`question${q}.third`} id={'textarea3'+q} className="materialize-textarea"  required></textarea>
                        <label  htmlFor={'textarea3'+q}>3 ответ</label>
                        </div>

                        <div className="input-field col s12">
                            <select onChange={e=>this.onChangeTrueAnswer(e)} value={this.state[`question${q}`].answer} name={`question${q}`} required className="browser-default">
                            <option value="0" id="dis">Выбери ответ на вопрос</option>
                            <option value="1">Правильный ответ 1</option>
                            <option value="2">Правильный ответ 2</option>
                            <option value="3">Правильный ответ 3</option>
                            </select>
                            {/* <label>Выбирите правильный ответ</label> */}
                        </div>

                    </div>
                </div>
                )
            })}
           <button type="submit" className="btn btn-primary">Добавить тест</button>
           </form>
        </div>)
    }
}

const mapStateToProps=(state)=>{
    return{
       pause:state.addTest.pause
    }
}

export default connect(mapStateToProps,{addToBD})(MyaddTest)
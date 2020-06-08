import React,{Component} from 'react'
import classes from './Auth.module.css'
import {auth,togglePause} from '../../redux/authReducer'
import {connect} from 'react-redux'
import Button from '../../UI/Button/Button'
import Input  from '../../UI/input/input'
import is from 'is_js'
import Loader from '../../UI/Loader/Loader'


class Auth1 extends Component{
  componentDidMount(){
    window.M.updateTextFields()
  }

  componentDidUpdate(PrevProps,PrevState){
    if(this.props.authenticated===true && (PrevState.group!==this.state.group||PrevState.fio!==this.state.fio)){
      const valid = this.state.fio.length>6 && this.state.group.length>0
      this.setState({disabled:valid})
    }
    
  }

    state={
        group:'',
        fio:'',
        disabled:false,
        isBusy:false,
        isLogin:false,
        isFormValid:false,
        formControls:{
            email:{
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите коректный email',
                valid:false,
                touched:false,
                validation:{
                    required:true,
                    email:true
                }
            },
                password:{
                    value: '',
                    type: 'password',
                    label: 'Пароль',
                    errorMessage: 'Введите коректный пароль',
                    valid:false,
                    touched:false,
                    validation:{
                        required:true,
                        minLength:6
                             }
                         }
        }
    }
    
    LoginHandler =() =>{
        this.props.togglePause(true);
        this.props.auth(
            this.state.formControls.email.value,
            this.state.formControls.password.value,
            false,
            false,
            true
        )
        this.setState({isLogin:true,isBusy:false});
    }
    registerHandler=()=>{
        this.props.togglePause(true);
        this.props.auth(
            this.state.formControls.email.value,
            this.state.formControls.password.value,
            this.state.group,
            this.state.fio,
            false
        )
        this.setState({isBusy:true,isLogin:false});
    }
    submitHandler=event=>{
        event.preventDefault()
    }
    
    validateControl(value,validation){
        if(!validation){
            return true
        }
        let isvalid=true

    if(validation.required){
        isvalid=value.trim()!=='' && isvalid
    }
    if(validation.email){
        isvalid= is.email(value) && isvalid
    }
    if(validation.minLength){
        isvalid=value.length>=validation.minLength && isvalid
    }
      
        return isvalid
    }
    
    onChangeHandler=(event,controlName)=>{
        const formControls={...this.state.formControls}
        const control={...formControls[controlName]}
    
        control.value=event.target.value
        control.touched=true
        control.valid=this.validateControl(control.value,control.validation)
        formControls[controlName]=control
    
        let isFormValid=true;
        Object.keys(formControls).forEach(name=>{
            isFormValid=formControls[name].valid && isFormValid
        })
    
        this.setState({
            formControls:formControls,
            isFormValid:isFormValid,
            isBusy:false,
            isLogin:false
        })
    }
    
    renderInputs (){
            const inputs=Object.keys(this.state.formControls).map((controlName,index)=>{
            const control = this.state.formControls[controlName]
          
            return(
                <Input 
                    key={controlName+index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event=>this.onChangeHandler(event,controlName)}
                />
            )
        })
    
        return  (<> {this.props.authenticated?
            <>
             <div className="input-field col s6">
                    <input onChange={e=>this.setState({group:e.target.value})} value={this.state.group} placeholder="Введите номер группы" id="first_name" type="text" className="validate" required/>
                    {/* <label htmlFor="first_name">номер группы</label> */}
                    <span className="helper-text"> Введите номер группы</span>
                </div>  
                <div className="input-field col s6">
                    <input onChange={e=>this.setState({fio:e.target.value})} value={this.state.fio} placeholder="Введите ФИО" id="fio" type="text" className="validate" required/>
                    {/* <label htmlFor="fio">ФИО</label> */}
                    <span className="helper-text">ФИО должно быть больше 6 символов</span>
                </div>  
            </>
            :null
           } {inputs} </>)
    }
    
        render(){
            if(this.props.pause){return <Loader />}
            return(
                <div className={classes.Auth}>
                    <div>
                        <h1>{this.props.authenticated?"Регистрация":"Войти"}</h1>
                        <form onSubmit={this.submitHandler} className={classes.AuthForm}>
                          
                          {this.renderInputs()}
                            {!this.props.authenticated?
                            <Button type="success" 
                            onClick={this.LoginHandler}
                            disabled={!this.state.isFormValid}
                            >
                            Войти</Button>
                            :
                            <Button type="primary" 
                            onClick={this.registerHandler}
                            disabled={!(this.state.isFormValid===true && this.state.disabled===true)}
                            >
                            Регистрация</Button>
                            }
                            {this.state.isBusy &&<span className={classes.error}>Login занят</span>}
                            {this.state.isLogin &&<span className={classes.error}>Неверный логин или пароль</span>}
                        </form>
                    </div>
                </div>
            )
        }
    }
    

   const mapStateToProps=(state)=>{
        return{
           pause:state.auth.pause,
           auth:state.auth.login
        }
    }

 export default connect(mapStateToProps,{auth,togglePause}) (Auth1)
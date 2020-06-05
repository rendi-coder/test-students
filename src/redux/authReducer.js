import Axios from 'axios'

const AUTH_SUCCESS="AUTH_SUCCESS"
const AUTH_LOGOUT="AUTH_LOGOUT"
const SET_PAUSE="SET_PAUSE"

let initialState={
        token:null,
        login: null,
        pause:false
}

const authReducer=(state=initialState,action)=>{
   
    switch(action.type){
         case AUTH_SUCCESS:
             return{
                 ...state,token:action.token,login:action.login
             }

        case AUTH_LOGOUT:
            return{
                ...state,token:null,login:null
            }    

        case SET_PAUSE:
            return{
            ...state,pause:action.state
        }
        default:
            return state;
    }

}



export const autoLogin=()=>{
   return async dispatch=>{
       const token=localStorage.getItem('token');
       const login=localStorage.getItem('login');
       if(!token){
           dispatch(logout());
       }else{
           const expirationDate=new Date(localStorage.getItem('expirationDate'));
           if(expirationDate<=new Date()){
                dispatch(logout());
           }else{
            dispatch(authSuccess(token,login));
            dispatch(autoLogout((expirationDate.getTime()-new Date().getTime())/1000));
           }
       }
   }
}

export const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');

    return {type:AUTH_LOGOUT}
}

const autoLogout=(time)=>{
    return dispatch=>{
        setTimeout(()=>{
            dispatch(logout())
        },time*1000)
    }
}

const authSuccess=(token,login)=>({type:AUTH_SUCCESS,token,login})

export const auth=(email,password,isLogin)=>{
    return async dispatch=>{
         const authData={
            email,
            password,
            returnSecureToken:true
        }

        let url=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDfQ2UV26CwEyRVRPYr2CikJRtzucu-Mvc`

        if(!isLogin){
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDfQ2UV26CwEyRVRPYr2CikJRtzucu-Mvc`;
        }
        try{
        const response= await Axios.post(url,authData);
        const data=response.data;
        const expirationDate=new Date(new Date().getTime()+ data.expiresIn*1000);
        

        localStorage.setItem('token',data.idToken);
        localStorage.setItem('login',data.email)
        localStorage.setItem('userId',data.localId);
        localStorage.setItem('expirationDate',expirationDate);
       
        dispatch(authSuccess(data.idToken,data.email));
        dispatch(autoLogout(data.expiresIn));
    }
    finally{
        dispatch(tooglePAuseAC(false))
    }
    }
}

const tooglePAuseAC=(state)=>({type:SET_PAUSE,state})
export const togglePause=(state)=>(dispatch)=>{
    dispatch(tooglePAuseAC(state))
}

export default authReducer;


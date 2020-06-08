import Axios from 'axios'

const AUTH_SUCCESS="AUTH_SUCCESS"
const AUTH_LOGOUT="AUTH_LOGOUT"
const SET_PAUSE="SET_PAUSE"
const GROUP_FIO = "GROUP_FIO"

let initialState={
        token:null,
        login: null,
        group:null,
        fio:null,
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

        case GROUP_FIO:return {
           ...state,
           group:action.payload.group,
           fio:action.payload.fio
        }

        default:
            return state;
    }

}



export const autoLogin=()=>{
   return async (dispatch,getState)=>{
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
           if(getState().auth.login!=="admin@gmail.com" && (!getState().auth.group || !getState().auth.fio)){         
                const response = await Axios.get(`https://testsstudents.firebaseio.com/Users/.json`)
                const login=getState().auth.login
                const  idx =  response.data.findIndex(e=>e.email===login)
                const {group,fio} = response.data[idx]
                dispatch({type:GROUP_FIO,payload:{group,fio}})
            }
            dispatch(autoLogout((expirationDate.getTime()-new Date().getTime())/1000));
           }
       }
   }
}


export const clearGroupFio=()=>async(dispatch)=>{
   dispatch({type:GROUP_FIO,payload:{group:null,fio:null}})
}

export const logout = ()=>{
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
            dispatch({type:GROUP_FIO,payload:{group:null,fio:null}})
        },time*1000)
    }
}

const authSuccess=(token,login)=>({type:AUTH_SUCCESS,token,login})

export const auth=(email,password,group,fio,isLogin)=>{
    return async (dispatch,getState)=>{
         const authData={
            email,
            password,
            returnSecureToken:true
        }

        let url=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDfQ2UV26CwEyRVRPYr2CikJRtzucu-Mvc`

        if(!isLogin){
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDfQ2UV26CwEyRVRPYr2CikJRtzucu-Mvc`;
            const response = await Axios.get(`https://testsstudents.firebaseio.com/Users/.json`)
            let lastIdx=0;if(response.data){lastIdx=response.data.length}
            await Axios.put(`https://testsstudents.firebaseio.com/Users/${lastIdx}/.json`,{email,group,fio})
        }
        try{
        const response= await Axios.post(url,authData);
        const data=response.data;
          
         if(email!=="admin@gmail.com"){         
            const response = await Axios.get(`https://testsstudents.firebaseio.com/Users/.json`)
             const  idx =  response.data.findIndex(e=>e.email===email)
             const {group,fio} = response.data[idx]
             dispatch({type:GROUP_FIO,payload:{group,fio}})
         }

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


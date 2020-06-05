import Axios from 'axios'

let initialState={
   pause:false,
}

const addTestReducer=(state=initialState,action)=>{

    switch(action.type){
        case "PAUSE": return{
            ...state,
            pause:action.payload
        }
        default:
            return state;
    }

}

export const addToBD=(test)=>{
    return async(dispatch)=>{
        dispatch({type:"PAUSE",payload:true})
        const id = (Math.floor(Math.random() * (1679615 - 0 + 1)) + 0).toString();
        const newTest=test
        newTest.id=id;
        await Axios.put(`https://testsstudents.firebaseio.com/Tests/${id}/.json`,newTest)
        dispatch({type:"PAUSE",payload:'redirect'})
        dispatch({type:"PAUSE",payload:false})
    }
}

export default addTestReducer
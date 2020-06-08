import Axios from "axios";
const GET_ALL_TESTS = "GET_ALL_TESTS"
const SET_TEST_BY_ID = "SET_TEST_BY_ID"
const LOADING = "Loading"
const COMLETED_TESTS="COMLETED_TESTS"
const ADMIN_PANEL = "ADMIN_PANEL"

let initialState={
   tests:[],
   completedTest:[],
   currentTest:{},
   loading:false,
   adminPanel:[],
   nameTest:''
}

const listTestsReducer=(state=initialState,action)=>{

    switch(action.type){

        case LOADING:return{
            ...state,
            loading:action.payload
        }

        case SET_TEST_BY_ID: return{
            ...state,
            currentTest:action.payload
        }

        case GET_ALL_TESTS: return{
            ...state,
            tests:action.payload
        }

        case  COMLETED_TESTS: return{
            ...state,
            completedTest:action.payload
        }

        case ADMIN_PANEL: return{
            ...state,
            adminPanel:action.payload.data,
            nameTest:action.payload.nameTest
        }

        default:
            return state;
    }

}

export const setLoading=(loading)=>({type:LOADING,payload:loading})

export const getTests=()=>async(dispatch,getState)=>{
    dispatch(setLoading(true))
    const response = await Axios.get(`https://testsstudents.firebaseio.com/TestsUsers/.json`)
    const tests = await Axios.get(`https://testsstudents.firebaseio.com/Tests.json`)
    let mcompleted=[]
    const student = getState().auth.login
    for (const key in response.data) {
        const length= response.data[key].length
        for(let i=0;i<length;i++){
      const candidate=response.data[key].findIndex(e=>e.student.login===student)
       if(candidate>=0){
           mcompleted.push(key)
       }
      }
    }
    
    const listTest=[]
    const listCompleted=[]
    for (const key in tests.data) {
        listTest.push(tests.data[key])
    }

    mcompleted.forEach(e=>{
        for(let i =0;i<listTest.length;i++){
            if(e===listTest[i].id){
                listCompleted.push(listTest[i])
                listTest.splice(i,1)
            }
        }
    })

    dispatch({type:GET_ALL_TESTS,payload:listTest})
    dispatch({type:COMLETED_TESTS,payload:listCompleted})
    dispatch(setLoading(false))
}

export const getTestById=(id)=>async(dispatch)=>{
    dispatch({type:LOADING,payload:true})
    const tests = await Axios.get(`https://testsstudents.firebaseio.com/Tests.json`)
    const currentTest={}
    const listTest=[]
    for (const key in tests.data[id]) {
        if(key==="id" || key==="titleTest"){
            currentTest[key]=tests.data[id][key]
        }else{
        listTest.push(tests.data[id][key])
        }
    }
    currentTest.test = listTest
    dispatch({type:SET_TEST_BY_ID,payload:currentTest})
    dispatch({type:LOADING,payload:false})
}


export const completedTest=(dataTest)=>async(dispatch,getState)=>{
    dispatch(setLoading(true))
    let {id,test}=getState().listTests.currentTest
    let rating=0
    dataTest.forEach((e,i) => {
        if(e===test[i].answer){
            rating++
        }
    });
    
    let {fio,group,login} = getState().auth;
    const student={
        login,group,fio
    }
    console.log(student)
    const Allusers = await Axios.get(`https://testsstudents.firebaseio.com/TestsUsers/${id}/.json`)
    let length=0;
    if(Allusers.data){
        length = Allusers.data.length
    }
    await Axios.put(`https://testsstudents.firebaseio.com/TestsUsers/${id}/${length}/.json`,{student,rating})
    dispatch(setLoading('redirect'))
    dispatch({type:SET_TEST_BY_ID,payload:{}}) //обновляю выбранный тест
}

export const getTestStudentById=(id)=>async(dispatch,getState)=>{
        dispatch(setLoading(true))
        const nameTest = getState().listTests.tests[getState().listTests.tests.findIndex(e=>e.id===id)].titleTest
      const response = await Axios.get(`https://testsstudents.firebaseio.com/TestsUsers/${id}/.json`)
       let data=[];
       if(response.data){
        response.data.forEach(e=>{
            data.push(e)
        })
        }
    
      dispatch({type:ADMIN_PANEL,payload:{data,nameTest}})
      dispatch(setLoading(false))
}

export default listTestsReducer
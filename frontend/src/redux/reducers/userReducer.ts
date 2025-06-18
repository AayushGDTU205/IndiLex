interface UserState{
    name:string,
    email:string,
    password:string,
    formStatus:string,
    isLawyer:boolean,
    isAdmin:boolean,
    isLoggedIn:boolean
}

const initialState:UserState={
    name:'',
    email:'',
    password:'',
    formStatus:'',
    isLawyer:false,
    isAdmin:false,
    isLoggedIn:false
}

type UserAction=
    |{
        type:'SET_USER',
        payload:{
            name:string;
            email:string;
            password:string;
            formStatus:string;
            isLawyer:boolean;
            isAdmin:boolean;
        };
    }
    |{
        type:'GET_USER';
    }

function userReducer(state:UserState=initialState,action:UserAction):UserState{
    switch(action.type){
        case 'SET_USER':
            return{
                ...state,
                name:action.payload.name,
                email:action.payload.email,
                password:action.payload.password,
                formStatus:action.payload.formStatus,
                isLawyer:action.payload.isLawyer,
                isAdmin:action.payload.isAdmin,
                isLoggedIn:true
            };
        case 'GET_USER':
            return state;
        default:
            return state;
    }
}

export type { UserAction };
export default userReducer;
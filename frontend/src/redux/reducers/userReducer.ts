interface UserState{
    id:number,
    name:string,
    email:string,
    password:string,
    formStatus:string,
    isLawyer:boolean,
    isAdmin:boolean,
    isLoggedIn:boolean
}

const initialState:UserState={
    id:0,
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
            id:number;
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
    |{
        type:'LOGOUT_USER';
    }

function userReducer(state:UserState=initialState,action:UserAction):UserState{
    switch(action.type){
        case 'SET_USER':
            return{
                ...state,
                id:action.payload.id,
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
        case 'LOGOUT_USER':
            return{
                ...state,
                id:0,
                name:'',
                email:'',
                password:'',
                formStatus:'',
                isLawyer:false,
                isAdmin:false,
                isLoggedIn:false
            }
        default:
            return state;
    }
}

export type { UserAction };
export default userReducer;
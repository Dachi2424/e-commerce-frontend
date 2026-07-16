import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import axios, { isAxiosError } from "axios";

type User = {
  id: number
  email: string
  username: string
  role: "user" | "admin"
  idNumber: string | null
  phone: string | null
}
type AuthState = {
  error: null | string
  loading: boolean
  user: User | null
}

type Action = 
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR", payload: string }
  // | { type: "SIGNUP", payload: User } removed since after signup we auto login
  | { type: "LOGIN", payload: User }
  | { type: "REFRESH_TOKEN", payload: User }
  | { type: "GET_INFO", payload: User }
  | { type: "CHANGE_PASSWORD" }
  | { type: "CHANGE_DATA", payload: Partial<User> }
  | { type: "LOG_OUT" }
  | { type: "LOG_OUT_ALL" }
  | { type: "DELETE_ACCOUNT" }


  type AuthContextType = {
    state: AuthState,
    refreshToken: () => Promise<void>,
    login: (data: {email: string, password: string}) => Promise<void>,
    signup: (data: {email: string, password: string, username: string}) => Promise<void>,
    getUserInfo: () => Promise<void>,
    changePassword: (data: {currentPassword: string, newPassword: string}) => Promise<void>,
    changeData: (data: {email?: string, username?: string, phone?: string, idNumber?: string}) => Promise<void>,
    logout: () => Promise<void>,
    logoutAll: () => Promise<void>,
    deleteAccount: () => Promise<void>,
  }




const initialState: AuthState = {
  error: null,
  loading: false,
  user: null
}


const ACTIONS = {
  // SIGNUP: "SIGNUP",
  LOGIN: "LOGIN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  GET_INFO: "GET_INFO",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  CHANGE_DATA: "CHANGE_DATA",
  LOG_OUT: "LOG_OUT",
  LOG_OUT_ALL: "LOG_OUT_ALL",
  DELETE_ACCOUNT: "DELETE_ACCOUNT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR"
} as const


function reducer(state: AuthState, action: Action): AuthState{
  switch(action.type){
    case ACTIONS.SET_LOADING:
      return {...state, error: null, loading: true}
    case ACTIONS.SET_ERROR:
      return {...state, error: action.payload, loading: false}
    // case ACTIONS.SIGNUP:
    //   return {...state, error: null, loading: false, user: action.payload}
    case ACTIONS.LOGIN:
      return {...state, error: null, loading: false, user: action.payload}
    case ACTIONS.REFRESH_TOKEN:
      return {...state, error: null, loading: false, user: action.payload}
    case ACTIONS.GET_INFO:
      return {...state, error: null, loading: false, user: action.payload}
    case ACTIONS.CHANGE_PASSWORD:
      return {...state, error: null, loading: false, user: null}
    case ACTIONS.CHANGE_DATA:
      return {...state, error: null, loading: false, user: state.user ? {...state.user, ...action.payload} : null}
    case ACTIONS.LOG_OUT:
      return {...state, error: null, loading: false, user: null}
    case ACTIONS.LOG_OUT_ALL:
      return {...state, error: null, loading: false, user: null}
    case ACTIONS.DELETE_ACCOUNT:
      return {...state, error: null, loading: false, user: null}
    default:
      return state;
  }
}



const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({children} : {children: ReactNode}){

  const [state, dispatch] = useReducer(reducer, initialState)

  async function getUserInfo(){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {withCredentials: true})
      dispatch({type: ACTIONS.GET_INFO, payload: res.data})
    } catch(err: unknown){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  async function refreshToken(){
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {withCredentials: true})
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {withCredentials: true})
      dispatch({type: ACTIONS.REFRESH_TOKEN, payload: res.data})
    } catch{
      dispatch({type: ACTIONS.LOG_OUT})
    }
  }

  async function signup({username, email, password} : {username: string, email: string, password: string}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {username, email, password}, {withCredentials: true})
      await login({ email, password })
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function login({email, password} : {email: string, password: string}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {email, password}, {withCredentials: true})
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {withCredentials: true})
      dispatch({type: ACTIONS.LOGIN, payload: res.data})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function changePassword({currentPassword, newPassword} : {currentPassword: string, newPassword: string}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.patch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {currentPassword, newPassword}, {withCredentials: true})
      dispatch({type: ACTIONS.CHANGE_PASSWORD})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function changeData({email, username, phone, idNumber} : {email?: string, username?: string, phone?: string, idNumber?: string}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/auth/change-data`, {email, username, phone, idNumber}, {withCredentials: true})
      dispatch({type: ACTIONS.CHANGE_DATA, payload: res.data})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function logout(){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/logout`, {withCredentials: true})
      dispatch({type: ACTIONS.LOG_OUT})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function logoutAll(){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/logout-all`, {withCredentials: true})
      dispatch({type: ACTIONS.LOG_OUT_ALL})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  async function deleteAccount(){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/delete-account`, {withCredentials: true})
      dispatch({type: ACTIONS.DELETE_ACCOUNT})
    } catch(err){
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }


  return(
    <AuthContext.Provider value={{state, refreshToken, login, signup, getUserInfo, changePassword, changeData, logout, logoutAll, deleteAccount}}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth(){
  const context = useContext(AuthContext)
  if(!context){
    throw new Error("useAuth must be used within an Authprovider")
  }
  return context
}


export default AuthProvider;


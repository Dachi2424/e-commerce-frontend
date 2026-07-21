import { createContext, useReducer, useEffect, type ReactNode, useContext } from "react";
import axios, {isAxiosError} from "axios";
import { useAuth } from "./AuthContext";


type Product = {
  id: number,
  name: string,
  description: string | null,
  price: string,
  stock: number,
  category: string,
  imageUrl: string[],
  specifications: Record<string, string> | null
}

type CartItem = {
  id: number,
  userId: number,
  productId: number,
  quantity: number,
  Products: Product
}

type CartState = {
  loading: boolean,
  error: null | string,
  cart: CartItem[]
}


type Action = 
  | {type: "SET_LOADING"}
  | {type: "SET_ERROR", payload: string}
  | {type: "GET_CART", payload: CartItem[]}
  | {type: "ADD_TO_CART", payload: CartItem}
  | {type: "UPDATE_QUANTITY", payload: {productId: number, quantity: number}}
  | {type: "DELETE_ITEM", payload: number} //the number is for productId
  | {type: "CLEAR_CART"};
   

type CartContextType = {
  state: CartState,
  getCart: () => Promise<void>,
  addToCart: (data: {productId: number, quantity: number}) => Promise<void>, 
  changeQuantity: (data: {productId: number, quantity: number}) => Promise<void>,
  deleteItem: (data: {productId: number}) => Promise<void>,
  clearCart: () => Promise<void> 
}




const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  GET_CART: "GET_CART",
  ADD_TO_CART: "ADD_TO_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  DELETE_ITEM: "DELETE_ITEM",
  CLEAR_CART: "CLEAR_CART"
} as const





const initialState: CartState = {
  loading: false,
  error: null,
  cart: []
}


function reducer(state: CartState, action: Action): CartState{
  switch (action.type){
    case ACTIONS.SET_LOADING:
      return {...state, error: null, loading: true}
    case ACTIONS.SET_ERROR:
      return {...state, error: action.payload, loading: false}
    case ACTIONS.GET_CART:
      return {...state, error: null, loading: false, cart: action.payload}
    case ACTIONS.ADD_TO_CART:
      return {...state, error: null, loading: false, cart: [...state.cart, action.payload]}
    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state, 
        error: null, 
        loading: false, 
        cart: state.cart.map((item) => 
          item.productId === action.payload.productId 
          ? {...item, quantity: action.payload.quantity}
          : item
        ) 
      }
    case ACTIONS.DELETE_ITEM:
      return {
        ...state, 
        error: null, 
        loading: false, 
        cart: state.cart.filter(item => item.productId !== action.payload)}
    case ACTIONS.CLEAR_CART:
      return {...state, error: null, loading: false, cart: []}
    default:
      return state
  }
}



const CartContext = createContext<CartContextType | undefined>(undefined)

function CartProvider({children} : {children: ReactNode}){
  const [state, dispatch] = useReducer(reducer, initialState)
  const {state: authState, refreshToken} = useAuth()

  async function getCart(){
    if(!authState.user) return;
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {withCredentials: true})
      dispatch({type: ACTIONS.GET_CART, payload: res.data})
    } catch(err){
      if(isAxiosError(err) && err.response?.status === 401){
        await refreshToken()
        try{
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {withCredentials: true})
          dispatch({type: ACTIONS.GET_CART, payload: res.data})
        } catch(retryErr){
          if(isAxiosError(retryErr)){
            dispatch({type: ACTIONS.SET_ERROR, payload: retryErr.response?.data?.error || "Something went wrong"})
          } else{
            dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
          }
        }
        return;
      }
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }


  useEffect(() => {
    getCart()
  }, [authState.user])


  async function addToCart({productId, quantity}: {productId: number, quantity: number}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {quantity}, {withCredentials: true})
      dispatch({type: ACTIONS.ADD_TO_CART, payload: res.data.cartItem})
    } catch(err){
      if(isAxiosError(err) && err.response?.status === 401){
        await refreshToken()
        try{
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {quantity}, {withCredentials: true})
          dispatch({type: ACTIONS.ADD_TO_CART, payload: res.data.cartItem})
        } catch(retryErr){
          if(isAxiosError(retryErr)){
            dispatch({type: ACTIONS.SET_ERROR, payload: retryErr.response?.data?.error || "Something went wrong"})
          } else{
            dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
          }
        }
        return;
      }
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }


  async function changeQuantity({productId, quantity}: {productId: number, quantity: number}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
        await axios.patch(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {quantity}, {withCredentials: true})
        dispatch({type: ACTIONS.UPDATE_QUANTITY, payload: {productId, quantity}})
      } catch(err){
        if(isAxiosError(err) && err.response?.status === 401){
          await refreshToken()
          try{
            await axios.patch(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {quantity}, {withCredentials: true})
            dispatch({type: ACTIONS.UPDATE_QUANTITY, payload: {productId, quantity}})
          } catch(retryErr){
            if(isAxiosError(retryErr)){
              dispatch({type: ACTIONS.SET_ERROR, payload: retryErr.response?.data?.error || "Something went wrong"})
            } else{
              dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
            }
          }
          return;
        }
        if(isAxiosError(err)){
          dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
        } else{
          dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
        }
    }
  }


  async function deleteItem({productId}: {productId: number}){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {withCredentials: true})
      dispatch({type: ACTIONS.DELETE_ITEM, payload: productId})
    } catch(err){
      if(isAxiosError(err) && err.response?.status === 401){
        await refreshToken()
        try{
          await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {withCredentials: true})
          dispatch({type: ACTIONS.DELETE_ITEM, payload: productId})
        } catch(retryErr){
          if(isAxiosError(retryErr)){
            dispatch({type: ACTIONS.SET_ERROR, payload: retryErr.response?.data?.error || "Something went wrong"})
          } else{
            dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
          }
        }
        return;
      }
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else{
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }

  
  async function clearCart(){
    dispatch({type: ACTIONS.SET_LOADING})
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart`, {withCredentials: true})
      dispatch({type: ACTIONS.CLEAR_CART})
    } catch(err){
      if(isAxiosError(err) && err.response?.status === 401){
        await refreshToken()
        try{
          await axios.delete(`${import.meta.env.VITE_API_URL}/cart`, {withCredentials: true})
          dispatch({type: ACTIONS.CLEAR_CART})
        } catch(retryErr){
          if(isAxiosError(retryErr)){
            dispatch({type: ACTIONS.SET_ERROR, payload: retryErr.response?.data?.error || "Something went wrong"})
          } else{
            dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
          }
        }
        return;
      }
      if(isAxiosError(err)){
        dispatch({type: ACTIONS.SET_ERROR, payload: err.response?.data?.error || "Something went wrong"})
      } else {
        dispatch({type: ACTIONS.SET_ERROR, payload: "Something went wrong"})
      }
    }
  }



  return(
    <CartContext.Provider value={{state, getCart, addToCart, changeQuantity, deleteItem, clearCart}}>
      {children}
    </CartContext.Provider>
  )
}


export function useCart() {
  const context = useContext(CartContext)
  if(!context){
    throw new Error("useCart cannot be used outside of CartProvider")
  }
  return context
}



export default CartProvider;
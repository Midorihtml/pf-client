import LOGIN_ACTIONS from './loginTypes';
import axios from 'axios';
import { backendUrl } from '../../../env';


const actionLoginRequest = () => {
    return {
        type: LOGIN_ACTIONS.LOGIN_CUSTOMER_INFO
    }
}

const actionLoginSuccess = (Customers) => {
    return {
        type: LOGIN_ACTIONS.ACTION_LOGIN_SUCCESS,
        payload: Customers
    }
}

const actionLoginFailure = (error) => {
    return {
        type: LOGIN_ACTIONS.ACTION_LOGIN_FAILURE,
        payload: error
    }
}

export const addLOGIN = (Customer) => {
    return (dispatch) => {
        dispatch(actionLoginRequest())
        let api = backendUrl + 'auth/register'
        console.log(`Login a customer: ${api}`)
        axios.post(api, Customer)
            .then(response => {
                console.log(response)
                dispatch(actionLoginSuccess(response))
            })
            .catch(error => {
                const msg = error.message
                dispatch(actionLoginFailure(msg))
            })
    }
}
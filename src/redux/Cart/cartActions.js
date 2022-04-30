import CART_ACTIONS from './cartTypes'
import axios from 'axios';
import { backendUrl } from '../../env.js';

//------------------------------------------------------
// Private Functions
//------------------------------------------------------

const setCartItemsRequest = () => {
    return {
        type: CART_ACTIONS.ACTION_CART_REQUEST
    }
}

//Failure for action
const setCartItemsFailure = (error) => {
    return {
        type: CART_ACTIONS.ACTION_CART_FAILURE,
        payload: error
    }
}

//success for fetching all Products
const setCartItemsSuccess = (cart) => {
    return {
        type: CART_ACTIONS.SET_CART_ITEMS,
        payload: cart
    }
}

const setCartItemsFromDBSuccess = (cart) => {
    return {
        type: CART_ACTIONS.SAVE_DB_CART_ITEMS,
        payload: cart
    }
}

const addToCartSuccess = (payload) => {
    return {
        type: CART_ACTIONS.ADD_TO_CART,
        payload
    }
}

const checkoutSuccess = (cart) => {
    return {
        type: CART_ACTIONS.CHECKOUT_SUCCESS,
        payload: cart
    }
}

const checkoutFailure = (error) => {
    return {
        type: CART_ACTIONS.CHECKOUT_FAILURE,
        payload: error
    }
}

const fetchCartItemsRequest = () => {
    return {
        type: CART_ACTIONS.ACTION_CART_REQUEST
    }
}

//Failure for action
const fetchCartItemsFailure = (error) => {
    return {
        type: CART_ACTIONS.ACTION_CART_FAILURE,
        payload: error
    }
}

//success for fetching all Products
const fetchCartItemsSuccess = (cart) => {
    return {
        type: CART_ACTIONS.ACTION_CART_SUCCESS,
        payload: cart
    }
}

//------------------------------------------------------
// Exported Functions
//------------------------------------------------------

export const addToCart = (payload) => {
    return dispatch => {
        dispatch(addToCartSuccess(payload))
    }
}

export const postCartToDB = (cartItems, userId) => {
    return dispatch => {
        dispatch(setCartItemsRequest())
        if (userId) {
            console.log(cartItems, '<--- payload data to add to cart');
            const backendItems = cartItems.map(product => {
                return {
                    product_id: product.product_id,
                    seller_id: product.seller_id,
                    quantity: product.itemsToBuy
                }
            })
            const backendData = {
                buyer_id: userId,
                products: backendItems
            }
            console.log(backendData, '<--- backend data to add to cart')

            axios.post(`${backendUrl}cart/`, backendData)
                .then(res => {
                    // console.log(res.data, '<--- data added to Cart Backend')
                    dispatch(setCartItemsFromDBSuccess(res.data))

                }).catch(err => {
                    dispatch(setCartItemsFailure(err))
                })

        }
    }
}

export const fetchCartItems = (userId) => {
    return (dispatch) => {
        dispatch(fetchCartItemsRequest());
        return axios.get(`${backendUrl}/cart/${userId}`)
            .then(response => {
                const cart = response.data;
                dispatch(fetchCartItemsSuccess(cart));
            })
            .catch(error => dispatch(fetchCartItemsFailure(error)));
    };
}

export const checkOutCart = (userId, external_reference) => {
    return (dispatch) => {
        dispatch(checkoutRequest());
        return axios.post(`${backendUrl}/mp_confirmation/?external_reference=${external_reference}`)
            .then(axios.delete(`${backendUrl}/cart/all/${external_reference}`, { body: { id: external_reference } })
                .then((data) => {
                    console.log("RESPONSE: ", data)
                    dispatch(checkoutSuccess(data));
                })
                .catch(error => dispatch(checkoutFailure(error))));
    };
}

export const getCartItems = (userId) => {
    // console.log("getting CartItems")
    const savedCartItems = JSON.parse(localStorage.getItem('savedCartItems')) === true;
    let cart = [];
    if (savedCartItems) {
        console.log("should find saved cart items");
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    return (dispatch) => {
        if (!userId && savedCartItems) {
            console.log("saving local cart items to redux");
            dispatch(setCartItemsSuccess(cart));
        }
        if (userId) {
            console.log(`saving local cart items from user: ${userId} to redux`);
            dispatch(setCartItemsSuccess(cart));
            /* 
                        return axios.get(`${backendUrl}cart/?id=${userId}`)
                            .then(response => {
                                const cart = response.data;
                                console.log(cart, "<--- cart from db");
                                dispatch(setCartItemsFromDBSuccess(cart));
                                localStorage.setItem('cart', cart);
                                localStorage.setItem('savedCartItems', true);
                            })
                            .catch(error => {
                                console.log(error);
                                dispatch(setCartItemsFailure(error));
                            });
             */
        }
    };
}

export const updateCartItem = (payload) => {
    return {
        type: CART_ACTIONS.UPDATE_TO_CART,
        payload
    }
}

export const removeFromCart = (payload) => {
    return {
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload
    }
}

export const emptyCart = () => {
    return {
        type: CART_ACTIONS.EMPTY_CART
    }
}

export const checkoutRequest = () => {
    return {
        type: CART_ACTIONS.CHECKOUT_REQUEST
    }
}

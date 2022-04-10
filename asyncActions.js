const redux = require('redux')
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware
const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')

const initialState = {
  loading: false,
  users: [],
  error: '',
}

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_REQUEST_SUCCESS = 'FETCH_USERS_REQUEST_SUCCESS'
const FETCH_USERS_REQUEST_FAILURE = 'FETCH_USERS_REQUEST_FAILURE'

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  }
}

const fetchUsersSuccess = users => {
  return {
    type: FETCH_USERS_REQUEST_SUCCESS,
    payload: users,
  }
}

const fetchUsersFailure = error => {
  return {
    type: FETCH_USERS_REQUEST_FAILURE,
    error: error,
  }
}

const fetchUsers = () => {
  return function(dispatch) {
    dispatch(fetchUsersRequest())
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        const users = response.data.map(user => user.id) 
        dispatch(fetchUsersSuccess(users))
      })  
      .catch(err => {
        dispatch(fetchUsersFailure(err.message))
      })
  }
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_USERS_REQUEST: {
      return {
        ...state,
        loading: true, 
      }
    } 

    case FETCH_USERS_REQUEST_SUCCESS: {
      return {
        ...state,
        loading: false, 
        users: action.payload,
        error: '', 
      }
    }

    case FETCH_USERS_REQUEST_FAILURE: {
      return {
        ...state, 
        loading: false, 
        users: [],
        error: action.payload,
      }
    }
    
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware))
store.subscribe(() => console.log(store.getState()) )
store.dispatch(fetchUsers())
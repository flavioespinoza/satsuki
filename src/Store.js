import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import reducer from './reducers/index'
import { init, emit } from './actions/websockets'

const middleware = applyMiddleware(promise(), thunk.withExtraArgument({ emit }))

export default createStore(reducer, middleware)
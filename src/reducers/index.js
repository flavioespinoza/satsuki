import { combineReducers } from 'redux'

import user from './userReducer'
import chartData from './chartDataReducer'

export default combineReducers({
  user,
  chartData,
})
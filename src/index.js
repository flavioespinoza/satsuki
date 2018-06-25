import React from 'react'
import ReactDOM from 'react-dom'
import TypeChooser from './components/TypeChooser'

import registerServiceWorker from './registerServiceWorker'

import store from './Store'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from './actions/chartDataActions'
import * as utils from './utils'

import MasterInputBase from './components/MasterSelect'
import MasterInputComp from './components/MasterSelect'

import User from './components/User'

import BaseSlaveInput from './components/Input'
import BasePercentBtns from './components/PercentBtns'
import BaseFibBtns from './components/FibBtns'
import BaseRiskAmount from './components/RiskAmount'
import BaseCurrency from './components/Currency'
import BaseBalanceAvailable from './components/Balance'
import BaseBalanceBalance from './components/Balance'
import DropDownMenuParadigmBuy from './components/DropDownMenuParadigm'

import CompSlaveInput from './components/Input'
import CompPercentBtns from './components/PercentBtns'
import CompFibBtns from './components/FibBtns'
import CompRiskAmount from './components/RiskAmount'
import CompCurrency from './components/Currency'
import CompBalanceAvailable from './components/Balance'
import CompBalanceBalance from './components/Balance'
import DropDownMenuParadigmSell from './components/DropDownMenuParadigm'

import Balances from './components/Balances'

import Markets from './components/Markets'
import ChartInterval from './components/ChartInterval'
import Chart from './components/Chart_fib'
import CancelOrderButtons from './components/CancelButtons'
import OrderList from './components/OrderList'
import OrderInfo from './components/OrderInfo'
import AutoTrade from './components/AutoTrade'
import RefreshDatBtn from './components/RefreshDataBtn'

import _ from 'lodash'

import endpoint from './endpoints/endpoint'
import io from 'socket.io-client'

/** LOGGING */
const log = require('ololog').configure({
  locate: false
})

/** WEBSOCKET */
const websocket = io(endpoint.production)

/** DATA */
export function ___get_data () {

  websocket.emit('get_data')

}

/** CHART CONTROLS */
export function ___new_chart_interval (__new_chart_interval) {

  websocket.emit('new_chart_interval', __new_chart_interval)

}
export function ___new_market (__new_market) {

  // console.log(JSON.stringify(__new_market, null, 2))
  websocket.emit('new_market', __new_market)

}

/** AUTO TRADE */
export function ___new_auto_sell_percentage (__new_auto_sell_percentage) {

  websocket.emit('new_auto_sell_percentage', __new_auto_sell_percentage)

}
export function ___new_auto_buy_percentage (__new_auto_buy_percentage) {

  websocket.emit('new_auto_buy_percentage', __new_auto_buy_percentage)

}
export function ___toggle_auto_sell (__bool) {

  websocket.emit('toggle_auto_sell', __bool)

}
export function ___toggle_auto_buy (__bool) {

  websocket.emit('toggle_auto_buy', __bool)

}

/** ORDER TRANSACTIONS */
export function ___fib_buy_orders (__fib_buy_orders) {

  // console.log('place_fib_buy_orders', __fib_buy_orders)
  websocket.emit('place_fib_buy_orders', __fib_buy_orders)

}
export function ___fib_sell_orders (__fib_sell_orders) {

  websocket.emit('place_fib_sell_orders', __fib_sell_orders)

}
export function ___replace_order (__replace_order) {

  websocket.emit('replace_order', __replace_order)

}
export function ___cancel_single_order (__order) {

  websocket.emit('cancel_single_order', __order)
  // ___clear_order_info()

}
export function ___cancel_all_orders (__orders) {

  websocket.emit('cancel_all_orders', __orders)
  // ___clear_order_info()

}

export function ___get_paradigm_worksheet (__get_worksheet) {
  websocket.emit('get_paradigm_worksheet', __get_worksheet)
}

/** PARADIGM WORKSHEETS */
websocket.on('selected_paradigm_worksheet', function (__selected_paradigm_worksheet) {

  const state = store.getState().chartData
  const side = state.side
  const slave_buy_risk = state.slave_buy_risk
  const slave_sell_risk = state.slave_sell_risk

  let risk = 0

  if (side === 'buy') {
    risk = slave_buy_risk
  } else if (side === 'sell') {
    risk = slave_sell_risk
  }

  const __selected_worksheet = __selected_paradigm_worksheet.worksheet
  const paradigmArray = []
  const lotSumArray = []

  for (let i = 0; i < __selected_worksheet.grid.length; i++) {
    if (i !== 0) {
      __selected_worksheet.grid[i][4].value = _.round(risk, 9)
      __selected_worksheet.grid[i][5].value = _.round(risk * __selected_worksheet.grid[i][3].value, 9)
      paradigmArray.push(__selected_worksheet.grid[i][0].value)
      lotSumArray.push(__selected_worksheet.grid[i][5].value)
    } else {
      for (let c = 0; c < __selected_worksheet.grid[i].length; c++) {
        __selected_worksheet.grid[i][c].readOnly = true
      }
    }
  }

  const lotSum = _.sum(lotSumArray)

  store.dispatch({type: 'SET_WORKSHEET', payload: __selected_worksheet})
  store.dispatch({type: 'SET_PARADIGM_ARRAY', payload: paradigmArray.reverse()})

  console.log('lotSumArray', lotSumArray)
  store.dispatch({type: 'LOT_SUM_ARRAY', payload: lotSumArray})
  store.dispatch({type: 'LOT_SUM', payload: lotSum})

})



/** AUTHENTICATON */
websocket.on('authentication', function (__authentication) {
  store.dispatch({type: 'SET_USER', payload: __authentication.user})
  store.dispatch({type: 'SET_AUTHENTICATION_STATUS', payload: __authentication.status})
  store.dispatch({type: 'SET_EXCHANGE_NAME', payload: __authentication.exchange_name})
})

/** ORDER UPDATES */
websocket.on('order_update', function (__order_update) {

  /** BUY ---- ORDER UPDATE */
  if (__order_update.side === 'buy') {

    store.dispatch({type: 'BUY_ORDER_UPDATE', payload: __order_update })

  }


  /** SELL ---- ORDER UPDATE */
  if (__order_update.side === 'sell') {

    store.dispatch({type: 'SELL_ORDER_UPDATE', payload: __order_update })

  }

})

websocket.on('open_buy_orders', function (__open_buy_orders) {

  store.dispatch({type: 'SET_OPEN_BUY_ORDERS', payload: __open_buy_orders});
  // log.blue('open_buy_orders')
  // console.log(__open_buy_orders)

})
websocket.on('open_sell_orders', function (__open_sell_orders) {

  store.dispatch({type: 'SET_OPEN_SELL_ORDERS', payload: __open_sell_orders})
  // log.red('open_sell_orders')
  // console.log(__open_sell_orders)

})

/** AUTO TRADE & AUTO TRADE PERCENTAGE */
websocket.emit('get_auto_sell_percentage')
websocket.emit('get_auto_buy_percentage')

websocket.emit('get_auto_sell_toggle')
websocket.emit('get_auto_buy_toggle')

websocket.on('auto_sell_percentage', function (__auto_sell_percentage) {
  store.dispatch({type: 'SET_AUTO_SELL_PERCENTAGE', payload: __auto_sell_percentage})
  log.lightRed('__auto_sell_percentage', __auto_sell_percentage)
})
websocket.on('auto_buy_percentage', function (__auto_buy_percentage) {
  store.dispatch({type: 'SET_AUTO_BUY_PERCENTAGE', payload: __auto_buy_percentage})
  log.lightBlue('__auto_buy_percentage', __auto_buy_percentage)
})

websocket.on('auto_sell_toggle', function (__bool) {
  store.dispatch({type: 'AUTO_SELL_TOGGLE', payload: __bool})
  log.red('auto_sell_toggle', __bool)
})
websocket.on('auto_buy_toggle', function (__bool) {
  store.dispatch({type: 'AUTO_BUY_TOGGLE', payload: __bool})
  log.blue('auto_buy_toggle', __bool)
})

websocket.on('auto_trade_order', function (__auto_trade) {

  // const snackbar_container = document.getElementById('snackbarBottom')
  // const handler = function (e) {
  //   // console.log('e', e)
  // }
  // const data = {
  //   message: `Auto Trade! :) -- ${__auto_trade.side}: ${__auto_trade.amount}`,
  //   timeout: 4800,
  //   actionHandler: handler,
  //   actionText: 'Close'
  // }
  // snackbar_container.MaterialSnackbar.showSnackbar(data)

})

/** CANCEL ORDERS */
websocket.on('single_order_cancelled', function (__single_order_cancelled) {

  // console.log('single_order_cancelled', __single_order_cancelled)

})
websocket.on('all_orders_cancelled', function (__all_orders_cancelled) {

  // console.log('all_orders_cancelled', __all_orders_cancelled)

})

/** ERROR HANDLING */
websocket.on('order_history_ERROR', function (__err) {

  log.red('order_history_ERROR: ' + utils.__error(__err))

})
websocket.on('replace_buy_order_ERROR', function (__err) {

  log.red('replace_buy_order_ERROR: ' + utils.__error(__err))

})
websocket.on('replace_sell_order_ERROR', function (__err) {

  log.red('replace_sell_order_ERROR: ' + utils.__error(__err))

})
websocket.on('place_limit_buy_order_ERROR', function (__err) {

  log.red('place_limit_buy_order_ERROR: ' + utils.__error(__err))

})
websocket.on('place_limit_sell_order_ERROR', function (__err) {

  log.red('place_limit_sell_order_ERROR: ' + utils.__error(__err))

})
websocket.on('cancel_single_order_ERROR', function (__err) {

  log.red('cancel_single_order_ERROR: ' + utils.__error(__err))

})
websocket.on('cancel_all_orders_ERROR', function (__err) {

  log.red('cancel_all_orders_ERROR: ' + utils.__error(__err))

})
websocket.on('candles_ERROR', function (__err) {

  log.red('candles_ERROR: ' + utils.__error(__err))

})
websocket.on('fib_buy_orders_ERROR', function (__err) {

  log.red('fib_buy_orders_ERROR: ' + utils.__error(__err))

})
websocket.on('fib_sell_orders_ERROR', function (__err) {

  log.red('fib_sell_orders_ERROR: ' + utils.__error())

})
websocket.on('balances_ERROR', function (__err) {

  log.red('balances_ERROR: ' + utils.__error(__err))

})
websocket.on('open_orders_ERROR', function (__err) {

  log.red('open_orders_ERROR: ' + utils.__error(__err))

})
websocket.on('auto_trade_ERROR', function (__err) {

  log.red('auto_trade_ERROR: ' + utils.__error(__err))

})
websocket.on('get_data_ERROR', function (__err) {

  log.red('get_data_ERROR: ' + utils.__error(__err))

})
websocket.on('init_websocket_ERROR', function (__err) {

  log.red('init_websocket_ERROR: ' + utils.__error(__err))

})
websocket.on('all_markets_ERROR', function (__err) {

  log.red('all_markets_ERROR: ' + utils.__error(__err))

})

/** DOM SELECTORS */
const baseSlaveInput = document.getElementById('baseSlaveInput')
const basePercentBtns = document.getElementById('basePercentBtns')
const baseFibBtns = document.getElementById('baseFibBtns')
const baseRiskAmount = document.getElementById('baseRiskAmount')
const baseCurrency = document.getElementById('baseCurrency')
const baseBalanceAvailable = document.getElementById('baseBalanceAvailable')
const baseBalanceBalance = document.getElementById('baseBalanceBalance')
const masterInputBase = document.getElementById('baseMasterInputSpan')

const compSlaveInput = document.getElementById('compSlaveInput')
const compPercentBtns = document.getElementById('compPercentBtns')
const compFibBtns = document.getElementById('compFibBtns')
const compRiskAmount = document.getElementById('compRiskAmount')
const compCurrency = document.getElementById('compCurrency')
const compBalanceAvailable = document.getElementById('compBalanceAvailable')
const compBalanceBalance = document.getElementById('compBalanceBalance')
const masterInputComp = document.getElementById('compMasterInputSpan')

const balances = document.getElementById('balances')
const allMarkets = document.getElementById('allMarkets')
const chartInterval = document.getElementById('chartInterval')
const chartComponent = document.getElementById('chart')
const paradigmDropDownMenu = document.getElementById('paradigmDropDownMenu')
const paradigmDropDownMenuSell = document.getElementById('paradigmDropDownMenuSell')
const spreadsheet = document.getElementById('spreadsheet')
const cancelBtns = document.getElementById('cancelBtns')
const orderList = document.getElementById('orderList')
const orderInfo = document.getElementById('orderInfo')
const autoTrade = document.getElementById('autoTrade')

const user = document.getElementById('user')
const refreshDataBtn = document.getElementById('refreshDataBtn')

/** HEADER */
ReactDOM.render(<Provider store={store}><RefreshDatBtn/></Provider>, refreshDataBtn)

/** ALL MARKETS */
websocket.on('all_markets', function (__markets) {

  let all_markets = __markets.all_markets
  let all_buy_orders = __markets.all_buy_orders
  let all_sell_orders = __markets.all_sell_orders

  for (let i = 0; i < all_markets.length; i++) {
    all_markets[i].buy_orders = []
    all_markets[i].sell_orders = []
  }

  if (all_buy_orders.length > 0) {

    _.each(all_buy_orders, function (__order, __i) {
      let idx = _.findIndex(all_markets, function (__market) {
        return __market.symbol === __order.symbol
      })
      all_markets[idx].buy_orders.push(__order)
    })

  }

  if (all_sell_orders.length > 0) {

    _.each(all_sell_orders, function (__order, __i) {
      let idx = _.findIndex(all_markets, function (__market) {
        return __market.symbol === __order.symbol
      })
      all_markets[idx].sell_orders.push(__order)
    })

  }

  let open_order_markets = _.filter(all_markets, function (__obj) {
    return __obj.buy_orders.length > 0 || __obj.sell_orders.length > 0

  })

  let non_open_markets = _.filter(all_markets, function (__obj) {
    return __obj.buy_orders.length <= 0 && __obj.sell_orders.length <= 0

  })

  let set_all_markets = open_order_markets.concat(non_open_markets)

  store.dispatch({type: 'SET_MARKET', payload: __markets.market})
  store.dispatch({type: 'SET_SYMBOL', payload: __markets.symbol})
  store.dispatch({type: 'SET_ALL_MARKETS', payload: set_all_markets})

  ReactDOM.render(<Provider store={store}><Markets/></Provider>, allMarkets)

});

/** BALANCES */
async function ___base_currency (__base_balances, __base_symbol) {
  if (_.isEmpty(__base_balances)) {
    return {
      Available: 0,
      Pending: 0,
      Balance: 0,
      Currency: __base_symbol,
    }
  } else {
    return {
      Available: utils.__toFixed(__base_balances.free, null, 2, 6, true),
      Pending: utils.__toFixed(__base_balances.used, null, 2, 6, true),
      Balance: utils.__toFixed(__base_balances.total, null, 2, 6, true),
      Currency: __base_symbol,
    }
  }
}
async function ___comp_currency (__comp_balances, __comp_symbol) {
  if (_.isEmpty(__comp_balances)) {
    return {
      Available: 0,
      Pending: 0,
      Balance: 0,
      Currency: __comp_symbol,
    }
  } else {
    return {
      Available: utils.__toFixed(__comp_balances.free, null, 2, 6, true),
      Pending: utils.__toFixed(__comp_balances.used, null, 2, 6, true),
      Balance: utils.__toFixed(__comp_balances.total, null, 2, 6, true),
      Currency: __comp_symbol,
    }
  }
}
async function ___set_balances (__base_balances, __base_symbol, __comp_balances, __comp_symbol) {

  const base_currency = await ___base_currency(__base_balances, __base_symbol)
  const comp_currency = await ___comp_currency(__comp_balances, __comp_symbol)

  const balances = {
    base_currency: base_currency,
    comp_currency: comp_currency,
  }

  store.dispatch({type: 'SET_BALANCES', payload: balances})
  store.dispatch({type: 'RESET_BUY_RISK', payload: base_currency})
  store.dispatch({type: 'RESET_SELL_RISK', payload: comp_currency})

}

websocket.on('all_balances', function (__all_balances) {

  log.blue('websocket --> all_balances...')

  if (!__all_balances) {
    return;
  }

  const allBalances = __all_balances

  let __base_symbol = __all_balances.base
  let __comp_symbol = __all_balances.comp

  store.dispatch({type: 'SET_BASE', payload: __base_symbol})
  store.dispatch({type: 'SET_COMP', payload: __comp_symbol})

  let base_balances = allBalances.all_balances[__all_balances.base];
  let comp_balances = allBalances.all_balances[__all_balances.comp];

  (async function () {

    await ___set_balances(base_balances, __base_symbol, comp_balances, __comp_symbol)

    ReactDOM.render(<Provider store={store}><BaseBalanceAvailable currencyType={'baseBalanceAvailable'} /></Provider>, baseBalanceAvailable)
    ReactDOM.render(<Provider store={store}><BaseCurrency currencyType={'baseCurrency'} /></Provider>, baseCurrency)
    ReactDOM.render(<Provider store={store}><BaseBalanceBalance currencyType={'baseBalanceBalance'} /></Provider>, baseBalanceBalance)
    ReactDOM.render(<Provider store={store}><MasterInputBase side={'buy'} /></Provider>, masterInputBase)
    ReactDOM.render(<Provider store={store}><BaseRiskAmount riskSide={'buyRisk'} /></Provider>, baseRiskAmount)

    ReactDOM.render(<Provider store={store}><CompBalanceAvailable currencyType={'compBalanceAvailable'} /></Provider>, compBalanceAvailable)
    ReactDOM.render(<Provider store={store}><CompCurrency currencyType={'compCurrency'} /></Provider>, compCurrency)
    ReactDOM.render(<Provider store={store}><CompBalanceBalance currencyType={'compBalanceBalance'} /></Provider>, compBalanceBalance)
    ReactDOM.render(<Provider store={store}><MasterInputComp side={'sell'} /></Provider>, masterInputComp)
    ReactDOM.render(<Provider store={store}><CompRiskAmount riskSide={'sellRisk'} /></Provider>, compRiskAmount)

  })()

})
websocket.on('updated_balance', function (__updated_balance) {

  // console.log('__updated_balance', JSON.stringify(__updated_balance, null, 2))
  let balances = store.getState().chartData.balances

  __updated_balance.Available = utils.__toFixed(__updated_balance.Available)
  __updated_balance.Balance = utils.__toFixed(__updated_balance.Balance)

  if (__updated_balance) {
    if (__updated_balance.Currency === balances.comp_currency.Currency) {
      balances.comp_currency = __updated_balance
    } else {
      balances.base_currency = __updated_balance
    }
  }

  store.dispatch({type: 'SET_BALANCES', payload: { base_currency: balances.base_currency, comp_currency: balances.comp_currency }})

})

/** SIDE (buy or sell) */
store.dispatch({type: 'SET_SIDE', payload: 'buy'})
store.dispatch({type: 'SET_ORDER_TYPE', payload: 'LIMIT_BUY'})

/** CANDLES, INTERVAL, ORDER HISTORY */
websocket.on('candle_data', function (__candle_data) {

  // console.log('__candle_data', __candle_data)

  if (!__candle_data) {
    return;
  }

  let __last = _.last(__candle_data.data)

  store.dispatch({type: 'SET_LAST', payload: __last})
  store.dispatch({type: 'SET_INTERVAL', payload: __candle_data.interval})

  _.each(__candle_data.data, function (__obj) {

    __obj.date = new Date(__obj.timestamp)

  })

  // console.log('__candle_data.order_history', __candle_data.order_history)

  store.dispatch({type: 'SET_CHART_DATA', payload: __candle_data.data})
  store.dispatch({type: 'SET_ORDER_HISTORY', payload: __candle_data.order_history})

  ReactDOM.render(<Provider store={store}><ChartInterval/></Provider>, chartInterval)
  ReactDOM.render(<Provider store={store}><ChartComponent/></Provider>, chartComponent)
  ReactDOM.render(<Provider store={store}><AutoTrade/></Provider>, autoTrade)


})

/** RIGHT ORDER CONTROLS */
ReactDOM.render(<Provider store={store}><OrderList /></Provider>, orderList)
ReactDOM.render(<Provider store={store}><OrderInfo /></Provider>, orderInfo)

ReactDOM.render(<Provider store={store}><BaseSlaveInput side={'buy'} /></Provider>, baseSlaveInput)
ReactDOM.render(<Provider store={store}><CompSlaveInput side={'sell'} /></Provider>, compSlaveInput)
ReactDOM.render(<Provider store={store}><BasePercentBtns side={'buy'} /></Provider>, basePercentBtns)
ReactDOM.render(<Provider store={store}><CompPercentBtns side={'sell'} /></Provider>, compPercentBtns)

ReactDOM.render(<Provider store={store}><BaseFibBtns side={'buy'} /></Provider>, baseFibBtns)
ReactDOM.render(<Provider store={store}><CompFibBtns side={'sell'} /></Provider>, compFibBtns)
ReactDOM.render(<Provider store={store}><CancelOrderButtons/></Provider>, cancelBtns)

/** CHART COMPONENT */
class ChartComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      chartHeight: 200
    }
  }
  componentDidMount () {
    const chartHeight =  document.getElementById('chart').clientHeight
    this.setState({
      chartHeight: chartHeight,
    })
  }
  render () {
    const { data, orders, margins, interval, market } = this.props
    return (
      <TypeChooser>
        { type => <Chart type={type}
                         height={this.state.chartHeight}
                         margins={margins}
                         data={data}
                         orders={orders}
                         interval={interval}
                         market={market}/> }
      </TypeChooser>
    )
  }
}

function mapStateToProps (state) {
  return {
    data: state.chartData.candleData,
    height: 720,
    margins: { left: 12, right: 56, top: 0, bottom: 0 },
    interval: state.chartData.interval,
    market: state.chartData.market,
    orders: state.chartData.openOrders,
    paradigmArray: state.chartData.paradigmArray,
    amountArray: state.chartData.amountArray,
    riskAmount: state.chartData.riskAmount,
    lotSumArray: state.chartData.lotSumArray,
    lotSum: state.chartData.lotSum,
    side: state.chartData.side
  }
}

function mapDispatchToProps (dispatch) {
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartComponent)

/** PARADIGMS */
setTimeout(function () {
  ReactDOM.render(<Provider store={store}><DropDownMenuParadigmBuy side={'buy'}/></Provider>, paradigmDropDownMenu)
  ReactDOM.render(<Provider store={store}><DropDownMenuParadigmSell side={'sell'}/></Provider>, paradigmDropDownMenuSell)
}, 5000)

ReactDOM.render(<Provider store={store}><User/></Provider>, user)

registerServiceWorker()
let __base = 'BTC'
let __comp = 'ZCL'

let __market_name = __base + '-' + __comp
let __market_symbol = __comp + '/' + __base
let __chart_interval = 'fiveMin'

console.log('__market_name', __market_name)
console.log('__market_symbol', __market_symbol)

let __last = null
let __bid = null
let __ask = null
let __limit = 10080

let auto_sell_percentage = 1.25
let auto_buy_percentage = 1.25
let auto_sell_toggle = true
let auto_buy_toggle = true

const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const ccxt = require('ccxt')

const signalR = require('./signalR')
const zlib = require('zlib')
const crypto = require('crypto')
const Q = require('q')
const log = require('ololog').configure({
  locate: false
})
const _ = require('lodash')

const nearest = require('nearest-date')

const paradigms = require('./paradigms').paradigms()

const index = require('./routes/index')
const port = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)

const Client = require('node-rest-client').Client
const client = new Client()

app.use(index)

process.on('unhandledRejection', function (reason, p) {
  // log.bright.yellow('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // log.bright.yellow(reason);
  // application specific logging, throwing an error, or other logic here
})

const io = socketIo(server)
let websocket // websocket websocket

let keys
if (process.env.NODE_ENV === 'production') {
  keys = require('./production')
} else {
  keys = require('./development')
}

const exchange_params = {
  name: 'bittrex',
  apiKey: keys.btrx_api_key,
  secret: keys.btrx_secret_key,
  nonce: function () {
    return this.milliseconds()
  }
}

const exchange_name = exchange_params.name
const api_key = exchange_params.apiKey
const secret_key = exchange_params.secret

let user = {}

if (keys.id == 1) {
  user = {
    id: 1,
    name: 'Flavio',
    age: 44,
    call_sign: 'Flavs'
  }
} else {
  user = {
    id: 2,
    name: 'Jeremiah',
    age: 4,
    call_sign: 'Stryfist'
  }
}
log.blue('user', JSON.stringify(user, null, 2))

const XCH = new ccxt.bittrex(exchange_params)

/** ORDER HISTORY (on load --> 1 time) */
let orderHistory = [];

async function map_order_history () {

  try {

    let fetchAllOrderHistory = await XCH.fetchClosedOrders()
    let fetchOrderHistory = _.filter(fetchAllOrderHistory, function (__obj) {
      return __obj.symbol === __market_symbol
    })

    return _.map(fetchOrderHistory, function (__obj) {

      if (!__obj.price) {
        __obj.price = __toFixed(__obj.cost / __obj.filled)
      }

      if (!__obj.average) {
        if (__obj.info.PricePerUnit) {
          __obj.average = __obj.info.PricePerUnit
        } else {
          __obj.average = __toFixed(__obj.cost / __obj.filled)
        }
      }

      if (__obj.side === 'buy') {

        let cost = __obj.cost
        let fee = __obj.fee.cost
        let total_cost = __toFixed(cost + fee, 6)
        __obj.total_cost = total_cost

        __obj.color = 'rgba(100, 149, 237, 0.25)'
        __obj.text_color = '#b1cbfbcc'
        __obj.long = 'LONG'

      } else if (__obj.side === 'sell') {

        let __return = __obj.cost
        let fee = __obj.fee.cost
        let total_return = __toFixed(__return - fee, 6)
        __obj.total_return = total_return

        __obj.color = 'rgba(255, 105, 180, 0.25)'
        __obj.text_color = '#f7d7e7a6'
        __obj.short = 'SHORT'

      }

      __obj.selected = false
      __obj.close = __obj.info.Closed

      let order_symbol = __obj.symbol
      let base_symbol = order_symbol.split('/')[1]

      if (base_symbol === 'USD' || base_symbol === 'USDT') {
        __obj.commission = __toFixed(__obj.fee.cost, 2)
      } else {
        __obj.commission = __toFixed(__obj.fee.cost, 9)
      }

      return __obj

    })

  } catch (__err) {

    log.red('map_order_history_ERROR', __err)

  }

}

(async function () {

  orderHistory = await map_order_history()

  let open_orders = await XCH.fetchOpenOrders()
  log.black(JSON.stringify(open_orders))

})();

/** Candles with Order History */
async function ___candles (__socket, __market_summary) {

  try {

    let __dates = []

    let __base_currency
    let __histo = 'histominute'
    let __aggregate = 1
    let __candle_interval = '1m'

    if (__chart_interval === 'oneMin') __aggregate = 1, __histo = 'histominute', __candle_interval = '1m'
    if (__chart_interval === 'fiveMin') __aggregate = 5, __histo = 'histominute', __candle_interval = '5m'
    if (__chart_interval === 'fifteenMin') __aggregate = 15, __histo = 'histominute', __candle_interval = '15m'
    if (__chart_interval === 'thirtyMin') __aggregate = 30, __histo = 'histominute', __candle_interval = '30m'
    if (__chart_interval === 'hour') __aggregate = 1, __histo = 'histohour', __candle_interval = '1h'
    if (__chart_interval === 'day') __aggregate = 1, __histo = 'histoday', __candle_interval = '1d'

    let base_currency = __base

    if (__base === 'USDT') base_currency = 'USD'

    let url = `https://min-api.cryptocompare.com/data/${__histo}?fsym=${__comp}&tsym=${base_currency}&limit=${__limit}&aggregate=${__aggregate}&e=${exchange_params.name}`

    let __order_history = []

    let ticker = await XCH.fetchTicker(__market_symbol)
    let orderHistory = await map_order_history()

    client.get(url, function (__candles, __response) {

      let __candles_obj = {
        'time': 1525569540,
        'close': 0.002018,
        'high': 0.002018,
        'low': 0.002,
        'open': 0.002,
        'volumefrom': 184.45,
        'volumeto': 0.3721
      }

      let first = _.first(__candles.Data)
      let last = _.last(__candles.Data)

      // log.lightBlue('_______first',  new Date(first.time * 1000))
      // log.lightRed('________last',  new Date(last.time * 1000))

      let candles = _.map(__candles.Data, function (__array, i) {

        if (__market_summary) {

          let __market_summary_obj = {
            MarketName: 'BTC-ZCL',
            High: 0.00223593,
            Low: 0.00193627,
            Volume: 185688.20240233,
            Last: 0.0019805,
            BaseVolume: 382.30194136,
            TimeStamp: 1525574652800,
            Bid: 0.0019805,
            Ask: 0.00199631,
            OpenBuyOrders: 1532,
            OpenSellOrders: 9560,
            PrevDay: 0.00204,
            Created: 1479241799730
          }

          __ask = __market_summary.Ask
          __bid = __market_summary.Bid
          __last = __market_summary.Last

        } else {

          __last = last.close

        }

        let market_summary_obj = {
          "MarketName": "BTC-ZCL",
          "High": 0.00223593,
          "Low": 0.00193627,
          "Volume": 186977.77579835,
          "Last": 0.00199,
          "BaseVolume": 385.02321154,
          "TimeStamp": 1525572696567,
          "Bid": 0.0019828,
          "Ask": 0.00199973,
          "OpenBuyOrders": 1528,
          "OpenSellOrders": 9567,
          "PrevDay": 0.00202492,
          "Created": 1479241799730
        }

        return {
          timestamp: (__array.time * 1000),
          open: __array.open,
          high: __array.high,
          low: __array.low,
          close: __array.close,
          volume: __array.volumefrom,
          volumefrom: __array.volumefrom,
          volumeto: __array.volumeto,
          last: ticker.last,
          ask: ticker.ask,
          bid: ticker.bid,
          index: i,
          long: null,
          short: null,
        }

      })

      if (candles) {

        if (candles.length && candles.length > 0) {

          __dates = candles.map((__obj, __i) => {

            candles[__i].orderHistory = []
            candles[__i].bid = __bid
            candles[__i].ask = __ask
            candles[__i].last = __last

            let date
            // log.blue('user.call_sign', user.call_sign)
            if (user.call_sign === 'Flavs') {
              date = new Date(__obj.timestamp)
            } else {
              date = new Date(__obj.timestamp + 2.16e+7)
            }

            return date

          })

          let __dates_last = _.last(__dates)

          if (__dates.length > 0) {

            if (orderHistory) {
              if (orderHistory.length > 0) {
                orderHistory.forEach((obj) => {

                  let __target = new Date(obj.close)
                  // log.lightRed(__target)
                  let __index = nearest(__dates, __target)
                  // log.lightCyan(__index)


                  obj.symbol = __market_symbol
                  obj.index = __index
                  obj.position = [__index, obj.average]
                  obj.selected = false
                  obj.groupSelected = false

                  /** BUY ============================================ */
                  if (obj.side === 'buy') {
                    obj.color = 'rgba(100, 149, 237, 0.25)'
                    obj.textColor = '#b1cbfbcc'
                    obj.long = 'LONG'
                    if (candles[__index]) {
                      candles[__index].long = 'LONG'
                    }
                  }

                  /** SELL =========================================== */
                  if (obj.side === 'sell') {
                    obj.color = 'rgba(255, 105, 180, 0.25)'
                    obj.textColor = '#f7d7e7a6'
                    obj.short = 'SHORT'
                    if (candles[__index]) {
                      candles[__index].short = 'SHORT'
                    }

                  }

                  __order_history.push(obj)

                })
              }
            }

            if (ticker.last) {
              candles[candles.length - 1].close = ticker.last
              candles[candles.length - 1].ask = ticker.ask
              candles[candles.length - 1].bid = ticker.bid
              candles[candles.length - 1].last = ticker.last
              // log.lightCyan(ticker)
            }

            __socket.emit('candle_data', {
              data: candles,
              interval: __chart_interval,
              market: __market_name,
              symbol: __market_symbol,
              last: __last,
              ask: __ask,
              bid: __bid,
              order_history: __order_history
            })

            if (__market_summary) {
              log.lightYellow('...')
            } else {
              log.lightCyan('...')
            }

          }

        }
      }

    })

  } catch (__err) {
    log.bright.cyan('___candles_ERROR', __err.message)
    __socket.emit('candles_ERROR', __err.message)
  }

}

/** Markets */
async function ___all_markets (__socket) {

  try {

    let __markets = await XCH.fetchMarkets()

    _.each(__markets, function (obj, i) {

      let __split = obj.info.MarketName.split('-')
      let __symbol = obj.symbol
      let __join = __split.join('')

      __markets[i].market = obj.info.MarketName
      __markets[i].logoUrl = obj.info.LogoUrl
      __markets[i].minTradeSize = obj.info.MinTradeSize
      __markets[i].notice = obj.info.Notice
      __markets[i].symbol = __symbol
      __markets[i].search = __join
      __markets[i].color = '#6A6A6A'

      if (obj.info.Notice) {
        __markets[i].color = 'red'
      }

    })

    let all_markets = {
      all_markets: __markets,
      market: __market_name,
      symbol: __market_symbol,
      base: __base,
      comp: __comp
    }

    __socket.emit('all_markets', {
      all_markets: all_markets.all_markets,
      all_buy_orders: [],
      all_sell_orders: [],
      market: __market_name,
      symbol: __market_symbol
    })

    log.cyan('all_markets')

  } catch (__err) {
    log.red('all_markets_ERROR', __err.message)
    __socket.emit('all_markets_ERROR', __err.message)
  }
}

/** Balances */
async function ___balances (__socket) {
  try {
    let fetch_all_balances = await XCH.fetchBalance()
    let all_balances = {
      all_balances: fetch_all_balances,
      base: __base,
      comp: __comp
    }
    __socket.emit('all_balances', all_balances)
    log.cyan('all_balances')
    // return all_balances

  } catch (__err) {
    log.red('balances_ERROR', __err.message)
    __socket.emit('balances_ERROR', __err.message)
  }
}

/** Open Orders */

function map_open_orders (__obj) {

  log.green(__obj.price)

  __obj.selected = false
  __obj.start = [0, __obj.price]
  __obj.end = [2000, __obj.price]
  __obj.appearance = {}
  __obj.appearance.stroke = color().side(__obj.side)
  __obj.appearance.strokeDasharray = 'ShortDot'
  __obj.type = 'XLINE'

  return __obj
}

async function ___open_orders (__socket) {

  try {
    const fetch_all_open_orders = await XCH.fetchOpenOrders()

    let open_orders = {

      buy_orders: _.map(_.filter(fetch_all_open_orders, function (__obj) {
        return __obj.symbol === __market_symbol && __obj.side === 'buy'
      }), function (__obj) {

        return map_open_orders(__obj)

      }),

      sell_orders: _.map(_.filter(fetch_all_open_orders, function (__obj) {
        return __obj.symbol === __market_symbol && __obj.side === 'sell'
      }), function (__obj) {

        return map_open_orders(__obj)

      }),

      all_buy_orders: _.map(_.filter(fetch_all_open_orders, function (__obj) {
        return __obj.side === 'buy'
      }), function (__obj) {

        return map_open_orders(__obj)
      }),

      all_sell_orders: _.map(_.filter(fetch_all_open_orders, function (__obj) {
        return __obj.side === 'sell'
      }), function (__obj) {

        return map_open_orders(__obj)

      })

    }

    __socket.emit('open_buy_orders', open_orders.buy_orders)
    __socket.emit('open_sell_orders', open_orders.sell_orders)

    // log.lightBlue('open_buy_orders', JSON.stringify(open_orders.buy_orders))
    // log.lightRed('open_sell_orders', JSON.stringify(open_orders.sell_orders))

  } catch (__err) {
    log.red('open_orders_ERROR', __err.message)
    __socket.emit('open_orders_ERROR', __err.message)
  }

}

/** Order Transaction Functions */
async function ___REPLACE_limit_buy_order (__buy_order, __socket) {

  try {

    let place_buy_order = await XCH.create_limit_buy_order(__buy_order.symbol, __buy_order.amount, __toFixed(__buy_order.price, null, 2, 8))

    let order = await XCH.fetchOrder(place_buy_order.id)

    order.start = [0, order.price]
    order.end = [2000, order.price]
    order.appearance = {}
    order.appearance.stroke = color().side(order.side)
    order.appearance.strokeDasharray = 'ShortDot'
    order.type = 'XLINE'
    order.status = 'open'

    return order

  } catch (__err) {

    log.bright.blue('REPLACE_limit_buy_order_ERROR ', __err.message);
    __socket.emit('REPLACE_limit_buy_order_ERROR',  { message: __err.message, order: __buy_order })

  }

}

async function ___REPLACE_limit_sell_order (__sell_order, __socket) {

  try {

    let place_sell_order = await XCH.create_limit_sell_order(__sell_order.symbol, __sell_order.amount, __toFixed(__sell_order.price, null, 2, 8))

    let order = await XCH.fetchOrder(place_sell_order.id)

    order.start = [0, order.price]
    order.end = [2000, order.price]
    order.appearance = {}
    order.appearance.stroke = color().side(order.side)
    order.appearance.strokeDasharray = 'ShortDot'
    order.type = 'XLINE'
    order.status = 'open'

    return order

  } catch (__err) {

    log.bright.red('REPLACE_limit_sell_order_ERROR ', __err.message);
    __socket.emit('REPLACE_limit_sell_order_ERROR',  { message: __err.message, order: __sell_order })

  }

}

async function ___replace_order (__replace_order, __socket) {

  if (__replace_order.side === 'sell') {

    try {

      let new_order = {
        market: __replace_order.symbol,
        symbol: __replace_order.symbol,
        amount: __replace_order.amount,
        price: __toFixed(__replace_order.NewPrice, null, 2, 8),
        type: 'limit'
      }

      let order_cancelled = await XCH.cancelOrder(__replace_order.id)

      __replace_order.status = 'cancel'

      let replace_order = await ___REPLACE_limit_sell_order(new_order, __socket)

    } catch (__err) {
      log.bright.red('replace_sell_order_ERROR ', __err.message)
      __socket.emit('replace_sell_order_ERROR', __err.message)
    }

  } else if (__replace_order.side === 'buy') {

    try {

      /** NEW AMOUNT (required on replace buy orders only) */
      let old_cost = __replace_order.amount * __replace_order.price
      let new_amount = old_cost / __replace_order.NewPrice

      let new_order = {
        market: __replace_order.symbol,
        symbol: __replace_order.symbol,
        amount: __toFixed(new_amount, null, 2, 8),
        price: __toFixed(__replace_order.NewPrice, null, 2, 8),
        type: 'limit'
      }

      let order_cancelled = await XCH.cancelOrder(__replace_order.id)

      __replace_order.status = 'cancel'

      let replace_order = await ___REPLACE_limit_buy_order(new_order, __socket)

    } catch (__err) {
      log.bright.blue('replace_buy_order_ERROR ', __err.message)
      __socket.emit('replace_buy_order_ERROR', __err.message)
    }

  }

}

async function ___cancel_order (__order, __socket) {

  try {

    let order = await XCH.cancelOrder(__order.id)

    __order.status = 'cancel'
    // __socket.emit('order_update', __order)

    log.magenta('cancel_order', JSON.stringify(__order))

    return __order

  } catch (__err) {

    log.red('cancel_order_ERROR', __err.message)
    __socket.emit('cancel_order_ERROR', __err.message)

  }

}

async function ___cancel_all_orders (__orders, __socket) {

  Q.allSettled(__orders.map(async (__order) => {

    let order = await ___cancel_order(__order, __socket)

  })).then(function (res) {

    if (res[0].reason) {
      log.black('cancel_all_orders_ERROR', res[0].reason.message)
      __socket.emit('cancel_all_orders_ERROR', res[0].reason.message)
    }

  })

}

async function ___fib_buy_orders (__fib_orders, __socket) {

  Q.allSettled(__fib_orders.map(async (__order) => {

    let fib_buy_orders = await ___place_limit_buy_order(__order, __socket)
    log.lightBlue('fib_buy_orders', JSON.stringify(fib_buy_orders))

  })).then(function (res) {

    if (res[0].reason) {
      log.black('___fib_buy_orders_ERROR', res[0].reason.message)
      __socket.emit('fib_buy_orders_ERROR', res[0].reason.message)
    }

  })

}

async function ___fib_sell_orders (__fib_orders, __socket) {

  Q.allSettled(__fib_orders.map(async (__order) => {

    let fib_order = await ___place_limit_sell_order(__order, __socket)

    log.magenta('fib_order', JSON.stringify(fib_order))

  })).then(function (res) {

    if (res[0].reason) {
      log.black('fib_sell_orders_ERROR', res[0].reason.message)
      __socket.emit('fib_sell_orders_ERROR', res[0].reason.message)
    }

  })

}

async function ___place_limit_buy_order (__buy_order, __socket) {

  try {

    let place_buy_order = await XCH.create_limit_buy_order(__buy_order.symbol, __buy_order.amount, __buy_order.price)

    let order = await XCH.fetchOrder(place_buy_order.id)

    order.start = [0, order.price]
    order.end = [2000, order.price]
    order.appearance = {}
    order.appearance.stroke = color().side(order.side)
    order.appearance.strokeDasharray = 'ShortDot'
    order.type = 'XLINE'
    order.status = 'open'

    return order

  } catch (__err) {

    log.bright.blue('place_limit_buy_order_ERROR ', __err.message);
    __socket.emit('place_limit_buy_order_ERROR',  { message: __err.message, order: __buy_order })

  }

}

async function ___place_limit_sell_order (__sell_order, __socket) {

  try {

    let place_sell_order = await XCH.create_limit_sell_order(__sell_order.symbol, __sell_order.amount, __sell_order.price)

    let order = await XCH.fetchOrder(place_sell_order.id)

    order.start = [0, order.price]
    order.end = [2000, order.price]
    order.appearance = {}
    order.appearance.stroke = color().side(order.side)
    order.appearance.strokeDasharray = 'ShortDot'
    order.type = 'XLINE'
    order.status = 'open'

    return order

  } catch (__err) {

    log.bright.red('place_limit_sell_order_ERROR ', __err.message);
    __socket.emit('place_limit_sell_order_ERROR',  { message: __err.message, order: __sell_order })

  }

}

async function ___auto_trade (__order, __socket) {

  try {

    if (__order.side === 'buy') {
      if (__order.side === 'buy' && auto_sell_toggle) {

        let buy_price = __order.price

        let sell_conversion_percentage = auto_sell_percentage / 100

        let profit_desired = buy_price * sell_conversion_percentage

        let sell_price = buy_price + profit_desired

        let final_sell_price = __toFixed(sell_price, null, 2, 8)

        let auto_trade_order = {
          price: final_sell_price,
          symbol: __order.symbol,
          amount: __order.amount,
        }

        let auto_sell_trade = await ___place_limit_sell_order(auto_trade_order, __socket)

        setTimeout(function () {
          if (auto_sell_trade) {
            __socket.emit('auto_trade_order', auto_sell_trade)
            return auto_sell_trade
          }
        }, 3000)

      } else {
        log.red('auto_sell_toggle is set to ', auto_sell_toggle)
      }
    } else if (__order.side === 'sell') {
      if (__order.side === 'sell' && auto_buy_toggle) {

        let sell_price = __order.price

        let buy_conversion_percentage = auto_buy_percentage / 100

        let profit_desired = sell_price * buy_conversion_percentage

        let buy_price = sell_price - profit_desired

        let final_buy_price = __toFixed(buy_price, null, 2, 8)

        let sell_cost = __order.cost
        // console.log('sell_cost', sell_cost)
        // console.log('final_buy_price', final_buy_price)
        let new_buy_amount = __order.cost / final_buy_price
        // console.log('new_buy_amount', new_buy_amount)

        let auto_trade_buy_order = {
          price: final_buy_price,
          symbol: __order.symbol,
          amount: __toFixed(__order.cost / final_buy_price, null, 2, 6),
        }

        let auto_buy_trade = await ___place_limit_buy_order(auto_trade_buy_order, __socket)

        if (auto_buy_trade) {
          setTimeout(function () {
            __socket.emit('auto_trade_order', auto_buy_trade)
            return auto_buy_trade
          }, 3000)
        }

      } else {
        log.blue('auto_buy_toggle is set to ', auto_buy_toggle)
      }
    }

  } catch (__err) {
    log.red('auto_trade_ERROR', __err.message)
    __socket.emit('auto_trade_ERROR', __err.message)
  }

}

async function ___get_data (__socket) {

  try {

    let open_orders = await ___open_orders(__socket)
    let candle_data = await ___candles(__socket)
    let all_balances = await ___balances(__socket)

    // log.cyan('___get_data()')

  } catch (__err) {
    log.red('___get_data_ERROR', __err.message)
    __socket.emit('get_data_ERROR', __err.message)
  }

}

/** Authentication Signature */
function ___signature (__secret_key, __data) {

  return crypto
    .createHmac('sha512', __secret_key)
    .update(__data)
    .digest('hex')

}

/** Websocket */
async function ___init_websocket (__on_private, __on_public, __socket) {

  try {

    log.magenta('___init_websocket()...')

    /** New SignalR websocket and C2 Hub */
    websocket = new signalR.client('wss://beta.bittrex.com/signalr', ['c2'])

    websocket.serviceHandlers.connected = function (connection) {

      log.bright.magenta('websocket.signalR.connected')

      /** Authentication Context */
      websocket.call('c2', 'GetAuthContext', api_key).done(function (err, challenge) {
        if (err) {
          log.red(err)
        }

        /** Signature */
        const signed_challenge = ___signature(secret_key, challenge)

        /** Authenticate */
        websocket.call('c2', 'Authenticate', api_key, signed_challenge).done(function (auth_err, auth_result) {
          if (auth_err) {
            log.red('auth_ERROR', auth_err)
          }

          log.yellow('auth_result', auth_result)
          log.yellow('user', user)

          __socket.emit('authentication', {
            user: user,
            status: true,
            exchange_name: exchange_name,
          })

          /** Balance Updated */
          websocket.on('c2', 'uB', __on_private)

          /** Order Update */
          websocket.on('c2', 'uO', __on_private)

        })

      })

      /** Public Delta Updates */
      /** Exchange Update */
      websocket.call('c2', 'SubscribeToExchangeDeltas', __market_name).done(function (err, result) {
        if (err) { return console.error(err) }
        if (result === true) {
          log.black('Subscribed to ' + __market_name)
          websocket.on('c2', 'uE', __on_public)
        }
      })

      /** Summary Update */
      websocket.call('c2', 'SubscribeToSummaryDeltas').done(function (err, result) {
        if (err) { return console.error(err) }
        if (result === true) {
          log.lightBlue('Subscribed to ' + __market_name)
          websocket.on('c2', 'uS', __on_public)
        }
      })

    }

  } catch (__err) {

    log.red('init_websocket_ERROR ', __err.message)
    __socket.emit('init_websocket_ERROR')

  }

}

/** Socket Connection to React Client */
io.on('connection', function (socket) {

  /** Websocket On Update Functions */
  function on_private (__update) {
    let raw = new Buffer.from(__update, 'base64')
    zlib.inflateRaw(raw, function (err, inflated) {
      if (!err) {
        let obj = JSON.parse(inflated.toString('utf8'))
        if (obj.o) {
          /** Order Updates */
          let order_update = updated_order(obj)
          if (order_update.side === 'buy') {
            log.lightBlue('uO', JSON.stringify(order_update))
          } else if (order_update.side === 'sell') {
            log.lightRed('uO', JSON.stringify(order_update))
          }
          let timeout = 2000 + (1000 * count)
          if (order_update.status === 'fill') {

            count++
            setTimeout(function () {
              orderHistory.push(order_update.info);
              (async function () {

                let auto_trade_order = await ___auto_trade(order_update, socket)
                log.lightYellow('auto_trade_order', JSON.stringify(auto_trade_order))

              })()
            }, timeout)

          }


          let mapped_order = map_open_orders(order_update)
          socket.emit('order_update', mapped_order)
        } else {
          /** Balance Updates */
          let balance = updated_balance(obj.d)
          // log.bright.cyan('updated_balance', JSON.stringify(balance))
          socket.emit('updated_balance', balance)
        }
      }
    })
  }

  function on_public (__update) {
    let raw = new Buffer.from(__update, 'base64')
    zlib.inflateRaw(raw, function (err, inflated) {
      if (!err) {
        let obj = JSON.parse(inflated.toString('utf8'))
        if (obj.f) {
          // log.lightGray('uE...', JSON.stringify(obj, null, 2))
        } else {
          let current_market = _.filter(obj.D, function (__obj) {
            return __obj.M === __market_name
          })
          if (current_market.length > 0) {
            const market_summary = summary_current_market(current_market[0]);

            // let market_summary_obj = {
            //   "MarketName": "BTC-ZCL",
            //   "High": 0.00223593,
            //   "Low": 0.00193627,
            //   "Volume": 186977.77579835,
            //   "Last": 0.00199,
            //   "BaseVolume": 385.02321154,
            //   "TimeStamp": 1525572696567,
            //   "Bid": 0.0019828,
            //   "Ask": 0.00199973,
            //   "OpenBuyOrders": 1528,
            //   "OpenSellOrders": 9567,
            //   "PrevDay": 0.00202492,
            //   "Created": 1479241799730
            // };

            /** Candle Update on Market Delta */
            (async function () {
              await ___candles(socket, market_summary)
            })()
          }
        }
      }
    })
  }

  log.blue('websocket connection')

  socket.on('disconnect', function (__disconnect) {

    log.yellow('__disconnect', __disconnect)

  });

  /** Initialize Websocket */
  (async function () {
    await ___get_data(socket)
    await ___all_markets(socket)
    await ___init_websocket(on_private, on_public, socket)
  })();


  /** Get Data */
  socket.on('get_data', function () {
    (async function () {
      orderHistory = []
      log.lightYellow('get_data')
      await ___get_data(socket)
    })()
  })

  /** Fib Orders */
  socket.on('place_fib_sell_orders', function (__fib_sell_orders) {
    (async function () {
      await ___fib_sell_orders(__fib_sell_orders, socket)
    })()
  })
  socket.on('place_fib_buy_orders', function (__fib_buy_orders) {
    (async function () {
      await ___fib_buy_orders(__fib_buy_orders, socket)
    })()
  })

  /** Cancel Single Order */
  socket.on('cancel_single_order', function (__order) {
    (async function () {
      let cancelled_order = await ___cancel_order(__order, socket)
      log.lightYellow('cancelled_order', JSON.stringify(cancelled_order))
    })()
  })

  /** Cancel All Orders */
  socket.on('cancel_all_orders', function (__orders) {
    (async function () {
      await ___cancel_all_orders(__orders, socket)
    })()
  })

  /** Replace Order */
  socket.on('replace_order', function (__order) {
    (async function () {
      await ___replace_order(__order, socket)
    })()
  })

  /** Auto Trade Percentage */
  socket.on('get_auto_sell_percentage', function () {
    socket.emit('auto_sell_percentage', auto_sell_percentage)

  })
  socket.on('get_auto_buy_percentage', function () {
    socket.emit('auto_buy_percentage', auto_buy_percentage)

  })

  socket.on('get_auto_sell_toggle', function () {
    socket.emit('auto_sell_toggle', auto_sell_toggle)
    log.red('auto_sell_toggle', auto_sell_toggle)
  })
  socket.on('get_auto_buy_toggle', function () {
    socket.emit('auto_buy_toggle', auto_buy_toggle)
    log.blue('auto_buy_toggle', auto_buy_toggle)
  })

  socket.on('toggle_auto_sell', function (__bool) {
    auto_sell_toggle = __bool
    socket.emit('auto_sell_toggle', auto_sell_toggle)
    log.red('auto_sell_toggle', auto_sell_toggle)
  })
  socket.on('toggle_auto_buy', function (__bool) {
    auto_buy_toggle = __bool
    socket.emit('auto_buy_toggle', auto_buy_toggle)
    log.blue('auto_buy_toggle', auto_buy_toggle)
  })

  socket.on('new_auto_sell_percentage', function (__new_auto_sell_percentage) {
    log.red('auto_sell_percentage', __new_auto_sell_percentage)
    auto_sell_percentage = __new_auto_sell_percentage
    socket.emit('auto_sell_percentage', __new_auto_sell_percentage)
  })
  socket.on('new_auto_buy_percentage', function (__new_auto_buy_percentage) {
    log.blue('auto_buy_percentage', __new_auto_buy_percentage)
    auto_buy_percentage = __new_auto_buy_percentage
    socket.emit('auto_buy_percentage', __new_auto_buy_percentage)
  })

  /** Chart Interval */
  socket.on('new_chart_interval', function (__new_chart_interval) {
    log.blue('new_chart_interval', __new_chart_interval)
    __chart_interval = __new_chart_interval;
    (async function () {
      let candles_new_interval = await ___candles(socket)
      socket.emit('candle_data', candles_new_interval)
    })()
  })

  /** MARKET (ETH-ETH, ETH-DOGE, ETH-ETH, etc...) */
  socket.on('new_market', function (__new_market) {
    let symbol = __new_market.symbol
    let split = symbol.split('/')
    __comp = split[0]
    __base = split[1]
    __market_name = __new_market.id
    __market_symbol = __new_market.symbol
  })

  /** Paradigms */
  socket.on('get_paradigm_worksheet', function (__get_paradigm_worksheet) {

    let idx = _.findIndex(paradigms, function (__obj) {
      return __obj._id === __get_paradigm_worksheet.title
    })

    socket.emit('selected_paradigm_worksheet', paradigms[idx])

  })

})

/** Response Formatting Helper Functions */
function __toFixed (__number, __digits, __min, __max) {

  const sign = Math.sign(__number)
  let digits

  if (!__number) {
    return 0
  } else {
    if (__min && __max) {
      if (__number > 1) {
        digits = __min
      } else {
        digits = __max
      }
    } else if (__digits) {
      digits = __digits
    } else {
      if (__number > 1) {
        digits = 2
      } else {
        digits = 10
      }
    }

    const reg_ex = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)')
    const number = __number.toString()

    const array = number.match(reg_ex)
    const result = array ? parseFloat(array[1]) : __number.valueOf()

    if (sign === -1) {
      return -result
    } else {
      return result
    }

  }
}

function map_keys (__key) {
  const min_keys = [
    {key: 'A', val: 'Ask'},
    {key: 'a', val: 'Available'},
    {key: 'B', val: 'Bid'},
    {key: 'b', val: 'Balance'},
    {key: 'C', val: 'Closed'},
    {key: 'c', val: 'Currency'},
    {key: 'D', val: 'Deltas'},
    {key: 'd', val: 'Delta'},
    {key: 'E', val: 'Exchange'},
    {key: 'e', val: 'ExchangeDeltaType'},
    {key: 'F', val: 'FillType'},
    {key: 'f', val: 'Fills'},
    {key: 'G', val: 'OpenBuyOrders'},
    {key: 'g', val: 'OpenSellOrders'},
    {key: 'H', val: 'High'},
    {key: 'h', val: 'AutoSell'},
    {key: 'I', val: 'Id'},
    {key: 'i', val: 'IsOpen'},
    {key: 'J', val: 'Condition'},
    {key: 'j', val: 'ConditionTarget'},
    {key: 'K', val: 'ImmediateOrCancel'},
    {key: 'k', val: 'IsConditional'},
    {key: 'L', val: 'Low'},
    {key: 'l', val: 'Last'},
    {key: 'M', val: 'MarketName'},
    {key: 'm', val: 'BaseVolume'},
    {key: 'N', val: 'Nonce'},
    {key: 'n', val: 'CommissionPaid'},
    {key: 'O', val: 'Orders'},
    {key: 'o', val: 'Order'},
    {key: 'P', val: 'Price'},
    {key: 'p', val: 'CryptoAddress'},
    {key: 'Q', val: 'Quantity'},
    {key: 'q', val: 'QuantityRemaining'},
    {key: 'R', val: 'Rate'},
    {key: 'r', val: 'Requested'},
    {key: 'S', val: 'Sells'},
    {key: 's', val: 'Summaries'},
    {key: 'T', val: 'TimeStamp'},
    {key: 't', val: 'Total'},
    {key: 'U', val: 'Uuid'},
    {key: 'u', val: 'Updated'},
    {key: 'V', val: 'Volume'},
    {key: 'W', val: 'AccountId'},
    {key: 'w', val: 'AccountUuid'},
    {key: 'X', val: 'Limit'},
    {key: 'x', val: 'Created'},
    {key: 'Y', val: 'Opened'},
    {key: 'y', val: 'State'},
    {key: 'Z', val: 'Buys'},
    {key: 'z', val: 'Pending'},
    {key: 'CI', val: 'CancelInitiated'},
    {key: 'FI', val: 'FillId'},
    {key: 'DT', val: 'OrderDeltaType'},
    {key: 'OT', val: 'OrderType'},
    {key: 'OU', val: 'OrderUuid'},
    {key: 'PD', val: 'PrevDay'},
    {key: 'TY', val: 'Type'},
    {key: 'PU', val: 'PricePerUnit'}
  ]
  return _.filter(min_keys, function (__obj) {
    return __obj.key === __key
  })[0].val
}

function side (__order_type) {
  if (__order_type === 'LIMIT_BUY') {
    return 'buy'
  } else if (__order_type === 'LIMIT_SELL') {
    return 'sell'
  }
}

function status (__id) {
  const status_types = [{
    id: 0,
    status: 'open'
  }, {
    id: 1,
    status: 'partial'
  }, {
    id: 2,
    status: 'fill'
  }, {
    id: 3,
    status: 'cancel'
  }]
  let filter = _.filter(status_types, function (__obj) {
    return __obj.id === __id
  })
  return filter[0].status
}

function add_drag_props (__obj) {
  __obj.symbol = __market_symbol
  __obj.start = [0, __obj.Limit]
  __obj.end = [10000, __obj.Limit]
  __obj.appearance = {}
  __obj.appearance.stroke = color().side(__obj.OrderType)
  __obj.appearance.strokeDasharray = 'ShortDot'
  __obj.type = 'XLINE'
  return __obj
}

function updated_order (__order) {

  const map = _.map([__order], function (__obj) {

    const order = __obj.o

    let fuck = _.mapKeys(order, function (__val, __key) {
      let key_long = map_keys(__key)
      return key_long
    })

    let info = add_drag_props(fuck)
    let total_return = null
    if (info.OrderType === 'LIMIT_SELL') {
      total_return = info.Price
    } else if (info.OrderType === 'LIMIT_BUY') {
      total_return = info.Price - info.Commission
    }

    let info_map = {
      'Uuid': null,
      'OrderUuid': info.OrderUuid,
      'Exchange': info.Exchange,
      'OrderType': info.OrderType,
      'Quantity': info.Quantity,
      'QuantityRemaining': info.QuantityRemaining,
      'Limit': info.Limit,
      'CommissionPaid': info.CommissionPaid,
      'Commission': info.Commission,
      'Price': info.Price,
      'PricePerUnit': info.PricePerUnit,
      'Opened': info.Opened,
      'Closed': info.Closed,
      'CancelInitiated': info.CancelInitiated,
      'ImmediateOrCancel': info.ImmediateOrCancel,
      'IsConditional': info.IsConditional,
      'Condition': info.Condition,
      'ConditionTarget': info.ConditionTarget,
      'symbol': __market_symbol,
      'start': info.start,
      'end': info.end,
      'appearance': info.appearance,
      'type': 'XLINE',
      'total_return': total_return,
    }

    return {
      status: status(__obj.TY),
      amount: __obj.o.Q,
      remaining: __obj.o.q,
      price: __obj.o.X,
      average: __obj.o.PU,
      uuid: __obj.o.U,
      id: __obj.o.OU,
      market_name: __obj.o.E,
      symbol: __market_symbol,
      side: side(__obj.o.OT),
      info: info
    }

  })

  return map[0]

}

function updated_balance (__balance) {
  const result_obj = {
    'Uuid': '018434b2-4d7b-4472-8f15-31b098c5fdf1',
    'AccountId': 924826,
    'Currency': 'BTC',
    'Balance': 0.01831561,
    'Available': 0.00573695,
    'Pending': 0,
    'CryptoAddress': '15EJW3TAZiq6bc47rAQM5xxdRJTXDF7KRA',
    'Requested': false,
    'Updated': 1525273561670,
    'AutoSell': null
  }
  return _.mapKeys(__balance, function (__val, __key) {
    let key_long = map_keys(__key)
    return key_long
  })

}

function summary_current_market (__summary) {
  return _.mapKeys(__summary, function (__val, __key) {
    let key_long = map_keys(__key)
    return key_long
  })
}

function color () {
  return {
    light: '#FFFFFF',
    buy: '#6495ed',
    sell: '#FF69B4',
    mid: '#555555',
    dark: '#444444',
    warning: '#F60300',

    buy_rgb: 'rgba(100, 149, 237, 1)',
    sell_rgb: 'rgba(255, 105, 180, 1)',
    mid_rgb: 'rgba(70, 70, 70, 1)',

    side_rgb: function (__side, __opacity) {
      if (__side === 'buy' || __side === 'LIMIT_BUY') {
        return 'rgba(100, 149, 237, ' + __opacity + ')'
      } else if (__side === 'sell' || __side === 'LIMIT_SELL') {
        let opacity = __opacity * 0.80
        return 'rgba(255, 105, 180, ' + opacity + ')'
      } else if (__side === 'all') {
        return 'rgba(68, 68, 68, ' + __opacity + ')'
      }
    },
    side: function (__side) {
      if (__side === 'buy' || __side === 'LIMIT_BUY') {
        return '#6495ED'
      } else if (__side === 'sell' || __side === 'LIMIT_SELL') {
        return '#FF69B4'
      }
    }
  }
}

/** Server Port */
server.listen(port, () => console.log(`Bittrex port ${port}`))
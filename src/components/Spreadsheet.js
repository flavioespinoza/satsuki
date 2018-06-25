import React, { Component } from 'react'
import DataSheet from 'react-datasheet/lib/DataSheet'
import 'react-datasheet/lib/react-datasheet.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
import io from 'socket.io-client'
import endpoint from '../endpoints/endpoint'
import store from '../Store'

const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

class SpreadSheet extends Component {

  constructor (props) {
    super(props)

    this.newFibOrder = this.newFibOrder.bind(this)
    this.confirm = this.confirm.bind(this)
    this.getOpenOrders = this.getOpenOrders.bind(this)
    this.clearSelected = this.clearSelected.bind(this)

    this.state = {
      expanded: 'false',
    }

  }

  componentDidMount () {

  }

  newFibOrder () {
    const actions = this.props.chartDataActions
    actions.enableFib(true)
    actions.toggleFibOrder(true)
  }

  confirm () {

    const __self = this
    const __selected = this.props.retracements_1[0]

    if (!__selected) {

      alert('You need to place a Fib Order on the chart!')

    } else {

      const actions = this.props.chartDataActions
      actions.toggleFibOrder(false)
      const __fib_orders = []
      const __dy = __selected.y2 - __selected.y1
      const __paradigm = this.props.paradigmArray
      const __side = this.props.side
      const __market = this.props.market
      const __symbol = this.props.symbol
      const __pricesArray = []
      const __buy_amounts_array = []
      const __amounts = this.props.lotSumArray

      _.each(__paradigm, function (__obj, __idx) {

        const __price = (__selected.y2 - (__obj / 100) * __dy)
        __pricesArray.push(__price)

        if (__side === 'sell') {

          __fib_orders.push({
            side: __side,
            market: __market,
            symbol: __symbol,
            price: utils.__toFixed(__price),
            amount: utils.__toFixed(__amounts[__idx]),
            type: 'limit'
          })

        } else if (__side === 'buy') {

          let buyAmount = 0

          if (__amounts[__idx] > 0) {
            buyAmount =  __amounts[__idx] / __price
          }

          if (buyAmount > 0) {
            __buy_amounts_array.push(utils.__toFixed(buyAmount))

          }

            __fib_orders.push({
              side: __side,
              market: __market,
              symbol: __symbol,
              price: utils.__toFixed(__price),
              amount: utils.__toFixed(buyAmount),
              type: 'limit'
            })

          }

      })

      log.yellow('__buy_amounts_array', __buy_amounts_array)

      // let go = [{"price":0.000264152,"symbol":"VTC/BTC","amount":2.69,"side":"sell"},{"price":0.000268659,"symbol":"VTC/BTC","amount":4.65,"side":"sell"},{"price":0.000268659,"symbol":"VTC/BTC","amount":10.95,"side":"sell"},{"price":0.000268659,"symbol":"VTC/BTC","amount":7.34,"side":"sell"},{"price":0.000268983,"symbol":"VTC/BTC","amount":19.54,"side":"sell"},{"price":0.000269378,"symbol":"VTC/BTC","amount":25.9,"side":"sell"},{"price":0.000269631,"symbol":"VTC/BTC","amount":30.41,"side":"sell"},{"price":0.000269692,"symbol":"VTC/BTC","amount":2.72,"side":"sell"},{"price":0.000269763,"symbol":"VTC/BTC","amount":148.88154466,"side":"sell"},{"price":0.000269763,"symbol":"VTC/BTC","amount":32.24,"side":"sell"},{"price":0.000270056,"symbol":"VTC/BTC","amount":3.69,"side":"sell"},{"price":0.000270157,"symbol":"VTC/BTC","amount":38.56,"side":"sell"},{"price":0.00027034,"symbol":"VTC/BTC","amount":34.31,"side":"sell"},{"price":0.000270421,"symbol":"VTC/BTC","amount":4.65,"side":"sell"},{"price":0.000270552,"symbol":"VTC/BTC","amount":44.87,"side":"sell"},{"price":0.000270795,"symbol":"VTC/BTC","amount":5.61,"side":"sell"},{"price":0.000270937,"symbol":"VTC/BTC","amount":51.15,"side":"sell"},{"price":0.000271049,"symbol":"VTC/BTC","amount":37.97,"side":"sell"},{"price":0.00027116,"symbol":"VTC/BTC","amount":6.38,"side":"sell"},{"price":0.000271211,"symbol":"VTC/BTC","amount":54.16,"side":"sell"},{"price":0.000271332,"symbol":"VTC/BTC","amount":57.77,"side":"sell"},{"price":0.000271525,"symbol":"VTC/BTC","amount":7.34,"side":"sell"},{"price":0.000271636,"symbol":"VTC/BTC","amount":61.74,"side":"sell"},{"price":0.000271727,"symbol":"VTC/BTC","amount":64.02,"side":"sell"},{"price":0.000271899,"symbol":"VTC/BTC","amount":8.29,"side":"sell"},{"price":0.000272001,"symbol":"VTC/BTC","amount":6.71,"side":"sell"},{"price":0.000272001,"symbol":"VTC/BTC","amount":13.43,"side":"sell"},{"price":0.000272071,"symbol":"VTC/BTC","amount":69.72,"side":"sell"},{"price":0.000272264,"symbol":"VTC/BTC","amount":9.24,"side":"sell"},{"price":0.000272446,"symbol":"VTC/BTC","amount":27.78970972,"side":"sell"},{"price":0.000272507,"symbol":"VTC/BTC","amount":77.25,"side":"sell"},{"price":0.000272639,"symbol":"VTC/BTC","amount":10,"side":"sell"},{"price":0.000273003,"symbol":"VTC/BTC","amount":10.95,"side":"sell"},{"price":0.000273368,"symbol":"VTC/BTC","amount":11.89,"side":"sell"},{"price":0.000273712,"symbol":"VTC/BTC","amount":40.24,"side":"sell"},{"price":0.000273732,"symbol":"VTC/BTC","amount":12.83,"side":"sell"},{"price":0.000274107,"symbol":"VTC/BTC","amount":13.58,"side":"sell"},{"price":0.000274472,"symbol":"VTC/BTC","amount":14.52,"side":"sell"},{"price":0.000274492,"symbol":"VTC/BTC","amount":30.57482406,"side":"sell"},{"price":0.000274634,"symbol":"VTC/BTC","amount":12.93009418,"side":"sell"},{"price":0.000274684,"symbol":"VTC/BTC","amount":6.49414589,"side":"sell"},{"price":0.000274705,"symbol":"VTC/BTC","amount":3.27730961,"side":"sell"},{"price":0.000274846,"symbol":"VTC/BTC","amount":15.45,"side":"sell"},{"price":0.000276649,"symbol":"VTC/BTC","amount":23.23,"side":"sell"},{"price":0.000276973,"symbol":"VTC/BTC","amount":19.28,"side":"sell"},{"price":0.000286725,"symbol":"VTC/BTC","amount":396.71,"side":"sell"}]
      // socket.emit('Place Limit Sell Fib Orders', go)


      if (__side === 'buy') {
        socket.emit('Place Limit Buy Fib Orders', __fib_orders)
        utils.refreshAutoTrade()
      } else if (__side === 'sell') {
        socket.emit('Place Limit Sell Fib Orders', __fib_orders)
      }

      actions.setPricesArray(__pricesArray)
      actions.setRetracements_1([])

    }

    setTimeout(function () {
      __self.getOpenOrders()
    }, 2500)
  }

  getOpenOrders () {
    const __self = this
    const actions = __self.props.chartDataActions
    socket.emit('get_open_orders', { msg: 'get_open_orders'})
    socket.on('open_orders', function (__open_orders) {
      actions.setOpenOrders(__open_orders)
    })
    const openOrders = __self.props.openOrders
    const textList_1 = __self.props.textList_1
    log.green('openOrders', openOrders.length)
    log.green('textList_1', textList_1.length)
  }

  clearSelected () {
    const actions = this.props.chartDataActions
    actions.setSelected([])
    actions.setOrderInfo([])
  }

  render () {

    const $colorBackground = '#22263A'

    const toggleFibOrder = this.props.toggleFibOrder
    const side = this.props.side
    let worksheet = this.props.worksheet

    if (!worksheet.grid) {
      worksheet = {
        title: '__p_single_order',
        worksheet_id: '__p_single_order',
        grid: [
          [
            {
              'value': 'y_%',
              'readOnly': true
            },
            {
              'value': 'x_coord',
              'readOnly': true
            },
            {
              'value': 'x_coord_Σ',
              'readOnly': true
            },
            {
              'value': 'x_%',
              'readOnly': true
            },
            {
              'value': 'risk',
              'readOnly': true
            },
            {
              'value': 'amount',
              'readOnly': true
            }
          ],
          [
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 100
            },
            {
              'value': 0
            }
          ],
          [
            {
              'value': 50
            },
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 100
            },
            {
              'value': 0
            }
          ],
          [
            {
              'value': 100
            },
            {
              'value': 0
            },
            {
              'value': 0
            },
            {
              'value': 1
            },
            {
              'value': 100
            },
            {
              'value': 100
            }
          ]
        ]
      }
    }

    const styles = {
      dataSheetWrapper: {
        width: 'calc(100% - 12px)',
        padding: 6,
        paddingBottom: 12,
        background: $colorBackground
      },
      title: {
        marginBottom: 6,
      },
      dataSheet: {
        width: 'calc(100% - 12px)',
      },
      fib_btns: {
        position: 'relative',
        background: color.side_rgb(side, 0.60),
        height: 42,
        width: '100%',
      },
      newFibOrderBtn: {
        position: 'absolute',
        height: 28,
        top: 6,
        left: 8,
        lineHeight: 2.25,
        background: 'gainsboro',
      },
      confirmBtn: {
        position: 'absolute',
        height: 28,
        top: 6,
        left: 160,
        lineHeight: 2.25,
        background: 'gainsboro',
      },
      clearSelectedBtn: {
        position: 'absolute',
        top: 6,
        right: 8,
        color: 'white'
      },
    }

    return (

      <div>

        <div style={styles.fib_btns}>

          <button style={styles.newFibOrderBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  disabled={toggleFibOrder}
                  onClick={this.newFibOrder}>
            New Fib Order
          </button>

          <button style={styles.confirmBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  disabled={!toggleFibOrder}
                  onClick={this.confirm}>
            Confirm Order
          </button>

          <button style={styles.clearSelectedBtn}
                  className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
                  onClick={this.clearSelected}>
            <i className="material-icons">clear_all</i>
          </button>

        </div>

        <div style={styles.dataSheetWrapper} className={'display-none'} >

          <div className="title" style={styles.title}>Paradigms</div>

          <DataSheet data={worksheet.grid}
                     style={styles.dataSheet}
                     valueRenderer={(cell) => cell.value}
                     onCellsChanged={changes => {
                       const grid = this.state.grid.map(row => [...row])
                       changes.forEach(({cell, row, col, value}) => {
                         grid[row][col] = {...grid[row][col], value}
                       })
                     }}/>

        </div>

      </div>

    )
  }
}

function mapStateToProps (state) {
  return {
    worksheet: state.chartData.worksheet,
    spreadsheet: state.chartData.spreadsheet,
    toggleFibOrder: state.chartData.toggleFibOrder,
    enableFib: state.chartData.enableFib,
    paradigm: state.chartData.paradigm,
    paradigmArray: state.chartData.paradigmArray,
    amountArray: state.chartData.amountArray,
    lotSumArray: state.chartData.lotSumArray,
    netGainsArray: state.chartData.netGainsArray,
    lotSum: state.chartData.lotSum,
    slaveRisk: state.chartData.slaveRisk,
    side: state.chartData.side,
    market: state.chartData.market,
    allMarkets: state.chartData.allMarkets,
    symbol: state.chartData.symbol,
    retracements_1: state.chartData.retracements_1,
    openOrders: state.chartData.openOrders,
    textList_1: state.chartData.textList_1,
    selected: state.chartData.selected,
    orderInfo: state.chartData.orderInfo,
  }
}


function mapDispatchToProps (dispatch) {
  // this function will now give you access to all your chartDataActions by simply calling this.props.actions.
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpreadSheet)
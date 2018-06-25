import React, { Component } from 'react'
import 'react-datasheet/lib/react-datasheet.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
import { ___fib_buy_orders} from '../index'
import { ___fib_sell_orders} from '../index'

const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

class FibBtns extends Component {

  constructor (props) {
    super(props)

    this.newFibOrder = this.newFibOrder.bind(this)
    this.confirm = this.confirm.bind(this)

    this.state = {}

  }

  newFibOrder () {
    const actions = this.props.chartDataActions
    const side = this.props.side
    actions.setSide(side)
    actions.enableFib(true)
    actions.toggleFibOrder(true)

  }

  confirm () {

    const __selected = this.props.retracements_1[0]

    if (!__selected) {

      alert('You need to place a Fib Order on the chart!')

    } else {

      const actions = this.props.chartDataActions
      const __side = this.props.side

      actions.toggleFibOrder(false)
      actions.setSide(__side)

      const __fib_orders = []
      const __dy = __selected.y2 - __selected.y1
      const __paradigm = this.props.paradigmArray
      const __market = this.props.market
      const __symbol = this.props.symbol
      const __pricesArray = []
      const __buy_amounts_array = []
      const __amounts = this.props.lotSumArray

      _.each(__paradigm, function (__obj, __idx) {

        const __price = (__selected.y2 - (__obj / 100) * __dy)
        __pricesArray.push(__price)

        if (__side === 'sell') {

          // console.log('sell __amounts[__idx]', __amounts[__idx])

          if (__amounts[__idx] > 0) {
            __fib_orders.push({
              side: __side,
              market: __market,
              symbol: __symbol,
              price: utils.__toFixed(__price, null, 2, 8),
              amount: utils.__toFixed(__amounts[__idx], null, 2, 8),
              type: 'limit'
            })
          }

        } else if (__side === 'buy') {

          let buyAmount = 0

          if (__amounts[__idx] > 0) {
            buyAmount =  __amounts[__idx] / __price
          }

          if (buyAmount > 0) {

            // console.log('buyAmounts', JSON.stringify(buyAmount, null, 2))

            __buy_amounts_array.push(utils.__toFixed(buyAmount))

            __fib_orders.push({
              side: __side,
              market: __market,
              symbol: __symbol,
              price: utils.__toFixed(__price, null, 2, 8),
              amount: utils.__toFixed(buyAmount, null, 2, 8),
              type: 'limit'
            })

          }

        }

      })

      if (__side === 'buy') {
        // console.log('__fib_orders', __fib_orders)
        ___fib_buy_orders(__fib_orders)
      } else if (__side === 'sell') {
        ___fib_sell_orders(__fib_orders)
      }

      actions.setPricesArray(__pricesArray)
      actions.setRetracements_1([])

    }

  }

  render () {

    const toggleFibOrder = this.props.toggleFibOrder
    const side = this.props.side

    const styles = {
      fib_btns: {
        position: 'relative',
        width: '100%',
        background: color.side_rgb(side, 0.60),
        paddingTop: 6,
        paddingLeft: 4,
        height: 42,
      },
      newFibOrderBtn: {
        position: 'relative',
        float: 'left',
        width: 'calc(50% - 8px)',
        height: 28,
        marginRight: 4,
        lineHeight: 2.25,
        background: 'gainsboro',
        fontSize: 12,
      },
      confirmBtn: {
        position: 'relative',
        float: 'left',
        width: 'calc(50% - 8px)',
        height: 28,
        lineHeight: 2.25,
        background: 'gainsboro',
        fontSize: 12,
      },
    }

    return (

      <div>

        <div style={styles.fib_btns}>

          <button style={styles.newFibOrderBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  disabled={toggleFibOrder}
                  onClick={this.newFibOrder}>
            New Fib
          </button>

          <button style={styles.confirmBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  disabled={!toggleFibOrder}
                  onClick={this.confirm}>
            Confirm
          </button>

        </div>

      </div>

    )
  }

}

function mapStateToProps (state) {
  return {
    precision: state.chartData.precision,
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
)(FibBtns)

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as utils from '../utils'
import * as actions from '../actions/chartDataActions'
import { ___cancel_all_orders } from '../index'

import _ from 'lodash'

const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

class CancelButtons extends React.Component {

  componentWillMount() {
    // const actions = this.props.actions
    this.cancelAllBuy = this.cancelAllBuy.bind(this)
    this.cancelAllSell = this.cancelAllSell.bind(this)
    this.cancelAllOrders = this.cancelAllOrders.bind(this)

  }

  cancelAllBuy (__all) {
    const actions = this.props.chartDataActions
    const open_buy_orders = this.props.open_buy_orders
    ___cancel_all_orders(open_buy_orders)
    actions.setOrderInfo({
      start: null,
      end: null,
    })
    if (!__all) {
      actions.setOpenBuyOrders([])
    }
  }

  cancelAllSell (__all) {
    const actions = this.props.chartDataActions
    const open_sell_order = this.props.open_sell_orders
    ___cancel_all_orders(open_sell_order)
    actions.setOrderInfo({
      start: null,
      end: null,
    })
    if (!__all) {
      actions.setOpenSellOrders([])
    }
  }

  cancelAllOrders () {
    const actions = this.props.chartDataActions
    actions.setOrderInfo([])
    actions.setOpenBuyOrders([])
    actions.setOpenSellOrders([])
    this.cancelAllBuy(true)
    this.cancelAllSell(true)
    setTimeout(function () {
      utils.refreshAutoTrade()
      actions.setOpenBuyOrders([])
      actions.setOpenSellOrders([])
    }, 3000)
  }

  render() {

    const styles = {
      parentContainer: {
        position: 'relative',
        width: '100%',
        height: 48,
        float: 'left',
      },
      cancelAllBuyBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        left: 12,
        lineHeight: 2.25,
        background: color.side_rgb('buy', 1),
        color: 'white',
        fontSize: 11,
      },
      cancelAllSellBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        left: 142,
        lineHeight: 2.25,
        background: color.side_rgb('sell', 1),
        color: 'white',
        fontSize: 11,
      },
      cancelAllOrdersBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        right: 12,
        lineHeight: 2.25,
        background: color.side_rgb('all', 1),
        color: 'white',
        fontSize: 11,
      }
    }

    const disabled = true

    return (
      <div style={styles.parentContainer}>

        <button style={styles.cancelAllBuyBtn}
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                onClick={() => {this.cancelAllBuy(false)}}>
          Cancel Buy
        </button>

        <button style={styles.cancelAllSellBtn}
                // disabled={disabled}
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={() => {this.cancelAllSell(false)}}>
          Cancel Sell
        </button>

        <button style={styles.cancelAllOrdersBtn}
                // disabled={disabled}
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                onClick={() => {this.cancelAllOrders()}}>
          Cancel All
        </button>

      </div>


    )
  }

}

function mapStateToProps (state) {
  return {
    data: state.chartData.candleData,
    balances: state.chartData.balances,
    height: 1200,
    openOrders: state.chartData.openOrders,
    open_buy_orders: state.chartData.open_buy_orders,
    open_sell_orders: state.chartData.open_sell_orders,
    textList_1: state.chartData.textList_1,
    orderHistory: state.chartData.orderHistory,
    orderHistoryList_1: state.chartData.orderHistoryList_1,
    allOrders: state.chartData.allOrders,
    orderViewToggle: state.chartData.orderViewToggle,
    ordersCancelled: state.chartData.ordersCancelled,
    margins: {left: 12, right: 56, top: 0, bottom: 0},
    interval: state.chartData.interval,
    market: state.chartData.market,
    symbol: state.chartData.symbol,
    side: state.chartData.side,
    risk: state.chartData.risk,
    base: state.chartData.base,
    comp: state.chartData.comp,
    orderType: state.chartData.orderType,
    paradigm: state.chartData.paradigm,
    paradigmArray: state.chartData.paradigmArray,
    amountsArray: state.chartData.amountsArray,
    riskAmount: state.chartData.riskAmount,
    baseAmount: state.chartData.baseAmount,
    riskDivision: state.chartData.riskDivision,
    close: state.chartData.close,
    enableFib: state.chartData.enableFib,
    toggleFibOrder: state.chartData.toggleFibOrder,
    retracements_1: state.chartData.retracements_1,
    retracements_3: state.chartData.retracements_3,
    resistance_high: state.chartData.resistance_high,
    resistance_mid: state.chartData.resistance_mid,
    resistance_low: state.chartData.resistance_low,
    inputStep: state.chartData.inputStep
  }
}

function mapDispatchToProps (dispatch) {
  return {
    chartDataActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CancelButtons)
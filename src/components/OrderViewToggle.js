
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chartDataActions from '../actions/chartDataActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import io from 'socket.io-client'
import __endpoint from '../endpoints/endpoint'
import * as utils from '../utils'
const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

class OrderViewToggle extends React.Component {

  constructor (props) {
    super(props)

    this.onSideChange = this.onSideChange.bind(this)
    this.cancelAllBuy = this.cancelAllBuy.bind(this)
    this.cancelAllSell = this.cancelAllSell.bind(this)
    this.cancelAllOrders = this.cancelAllOrders.bind(this)

    this.state = {}

  }

  onSideChange (e, __view_toggle) {
    this.props.chartDataActions.setOrderViewToggle(__view_toggle)
    this.props.chartDataActions.setOrderInfo([])
  }
  cancelAllBuy () {
    const actions = this.props.chartDataActions
    const openOrders = this.props.openOrders
    let sellOrders = []
    for (let i = 0; i < openOrders.length; i++) {
      if(openOrders[i].OrderType === 'LIMIT_BUY') {
        utils.cancelOrder(openOrders[i].OrderUuid, socket)
      } else {
        sellOrders.push(openOrders[i])
      }
    }
    setTimeout(function () {
      actions.setOrderInfo([])
      actions.setOpenOrders(sellOrders)
    }, 2500)
  }

  cancelAllSell () {
    const actions = this.props.chartDataActions
    const openOrders = this.props.openOrders
    let buyOrders = []
    for (let i = 0; i < openOrders.length; i++) {
      if(openOrders[i].OrderType === 'LIMIT_SELL') {
        utils.cancelOrder(openOrders[i].OrderUuid, socket)
      } else {
        buyOrders.push(openOrders[i])
      }
    }
    setTimeout(function () {
      actions.setOrderInfo([])
      actions.setOpenOrders(buyOrders)
    }, 2500)
  }

  cancelAllOrders () {
    const actions = this.props.chartDataActions
    const openOrders = this.props.openOrders
    for (let i = 0; i < openOrders.length; i++) {
      utils.cancelOrder(openOrders[i].id, socket)
    }
    setTimeout(function () {
      actions.setOrderInfo([])
      actions.setOpenOrders([])
    }, 2500)
  }

  render () {

    const side = this.props.side

    const styles = {
      block: {
        maxWidth: 250
      },
      parentContainer: {
        position: 'relative',
        width: '100%',
        height: 48,
        float: 'left',
        background: color.side_rgb(side, 0.60)
      },
      cancelAllBuyBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        left: 12,
        lineHeight: 2.25,
        background: 'gainsboro',
        fontSize: 11,
      },
      cancelAllSellBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        left: 142,
        lineHeight: 2.25,
        background: 'gainsboro',
        fontSize: 11,
      },
      cancelAllOrdersBtn: {
        position: 'absolute',
        width: 120,
        height: 28,
        top: 10,
        right: 12,
        lineHeight: 2.25,
        background: 'gainsboro',
        fontSize: 11,
      }
    }

    return (
      <MuiThemeProvider>

        <div style={styles.parentContainer}>

          <button style={styles.cancelAllBuyBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={this.cancelAllBuy}>
            Cancel Buy
          </button>

          <button style={styles.cancelAllSellBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={this.cancelAllSell}>
            Cancel Sell
          </button>

          <button style={styles.cancelAllOrdersBtn}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                  onClick={this.cancelAllOrders}>
            Cancel All
          </button>

        </div>

      </MuiThemeProvider>
    )
  }

}

function mapStateToProps(state) {
  return {
    openOrders: state.chartData.openOrders,
    textList_1: state.chartData.textList_1,
    orderHistory: state.chartData.orderHistory,
    orderInfo: state.chartData.orderInfo,
    orderViewToggle: state.chartData.orderViewToggle,
    side: state.chartData.side,
  }
}

function mapDispatchToProps(dispatch) {
  // this function will now give you access to all your chartDataActions by simply calling this.props.actions.
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderViewToggle)
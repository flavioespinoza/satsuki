import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Checkbox from 'material-ui/Checkbox'

class DragToggles extends React.Component {

  constructor (props) {
    super(props)

    this.toggleDrag = this.toggleDrag.bind(this)

  }

  componentWillMount() {
    const actions = this.props.chartDataActions
  }

  toggleDrag (e, __side) {

    const actions = this.props.chartDataActions

    if (e.target.checked && __side === 'buy') {
      actions.dragBuy(true)
    } else if (!e.target.checked && __side === 'buy') {
      actions.dragBuy(false)
    }

    if (e.target.checked && __side === 'sell') {
      actions.dragSell(true)
    } else if (!e.target.checked && __side === 'sell') {
      actions.dragSell(false)
    }

  }

  render() {

    const __style = {
      div: {
        width: '48%',
      },
      label: {
        color: '#FFFFFF !important',
        fontSize: 9,
        marginBottom: 4,
        paddingTop: 3,
      },
      icon: {
        fill: 'white',
        opacity: 0.65,
        width: 20,
        height: 20,
        marginTop: 2,
        marginRight: 3,
        marginBottom: 3,
      },
    }

    return (
      <MuiThemeProvider>

        <div>


          <div className={'pos-rel fl'} style={__style.div}>
            <Checkbox id={'drag_sell'}
                      iconStyle={__style.icon}
                      labelStyle={__style.label}
                      label={'Drag Sell'}
                      onCheck={(e) => this.toggleDrag(e, 'sell')} />
          </div>

          <div className={'pos-rel fl'} style={__style.div}>
            <Checkbox id={'drag_buy'}
                      iconStyle={__style.icon}
                      labelStyle={__style.label}
                      label={'Drag Buy'}
                      onCheck={(e) => this.toggleDrag(e, 'buy')} />
          </div>

        </div>

      </MuiThemeProvider>
    )
  }

}

function mapStateToProps (state) {
  return {
    data: state.chartData.candleData,
    balances: state.chartData.balances,
    height: 1200,
    openOrders: state.chartData.openOrders,
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
    inputStep: state.chartData.inputStep,
    drag_BUY: state.chartData.drag_BUY,
    drag_SELL: state.chartData.drag_SELL,
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
)(DragToggles)
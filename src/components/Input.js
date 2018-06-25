import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
const log = require('ololog').configure({
  locate: false
})

class Input extends React.Component {

  constructor(props) {
    super(props)

    this.setSlaveRisk = this.setSlaveRisk.bind(this)

    this.state = {}

  }

  componentDidMount () {
    const actions = this.props.chartDataActions
    const side = this.props.side
    const slave_buy_risk = this.props.slave_buy_risk
    const slave_sell_risk = this.props.slave_sell_risk

    if (side === 'buy') {
      actions.setSlaveBuyRisk(slave_buy_risk)
    } else if (side === 'sell') {
      actions.setSlaveSellRisk(slave_sell_risk)
    }
  }

  setSlaveRisk (e) {

    const actions = this.props.chartDataActions
    const side = this.props.side
    const slave_risk = +e.target.value
    const __selected_worksheet = this.props.worksheet
    const risk = utils.__toFixed(slave_risk)

    if (side === 'buy') {
      actions.setSlaveBuyRisk(risk)
    } else if (side === 'sell') {
      actions.setSlaveSellRisk(risk)
    }

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

    actions.setParadigmArray(paradigmArray.reverse())
    actions.setLotSumArray(lotSumArray)
    actions.setLotSum(lotSum)

  }

  render() {

    const slave_buy_risk = this.props.slave_buy_risk
    const slave_sell_risk = this.props.slave_sell_risk
    const side = this.props.side

    let slave_risk

    if (side === 'buy') {
      slave_risk = utils.__toFixed(slave_buy_risk, null, 2, 8)
    } else if (side === 'sell') {
      slave_risk = utils.__toFixed(slave_sell_risk, null, 2, 8)
    }

    const __style = {
      input: {
        width: 'calc(50% - 24px)',
        marginTop: 4,
        marginLeft: 8,
      }
    }

    return (

      <input id="baseMasterInput"
             style={__style.input}
             type="number"
             step={0.0005}
             value={slave_risk}
             onChange={this.setSlaveRisk}
      />

    )
  }

}

function mapStateToProps (state) {
  return {

    masterPercent: state.chartData.masterPercent,
    balances: state.chartData.balances,

    percentId: state.chartData.percentId,
    slavePercentId: state.chartData.slavePercentId,
    percent: state.chartData.percent,
    slavePercent: state.chartData.slavePercent,

    slave_buy_risk: state.chartData.slave_buy_risk,
    slave_sell_risk: state.chartData.slave_sell_risk,

    worksheet: state.chartData.worksheet,

    data: state.chartData.candleData,
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
)(Input)
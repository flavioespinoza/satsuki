import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Checkbox from 'material-ui/Checkbox'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
import { ___new_auto_sell_percentage } from '../index'
import { ___new_auto_buy_percentage } from '../index'
import { ___toggle_auto_sell } from '../index'
import { ___toggle_auto_buy } from '../index'

const color = utils.color()
const log = require('ololog').configure({
  locate: false
})

class PercentBtns extends Component {

  constructor(props) {
    super(props)

    this.setSlavePercentage = this.setSlavePercentage.bind(this)
    this.setAutoTradePercentage = this.setAutoTradePercentage.bind(this)
    this.toggleAutoBuy = this.toggleAutoBuy.bind(this)
    this.toggleAutoSell = this.toggleAutoSell.bind(this)
    this.toggleDragBuy = this.toggleDragBuy.bind(this)
    this.toggleDragSell = this.toggleDragSell.bind(this)

    this.state = {}

  }

  setSlavePercentage (__idx, __id, __percent) {

    // console.log('__percent', __percent)
    // console.log('__id', __id)

    const actions = this.props.chartDataActions
    const side = this.props.side
    const buy_risk = this.props.buy_risk
    const sell_risk = this.props.sell_risk
    
    const __selected_worksheet = this.props.worksheet

    let risk

    if (side === 'buy') {
      risk = utils.__toFixed(buy_risk * __percent, 6)
      actions.setSlaveBuyRisk(risk)
      actions.setPercentageSelected(__id, __percent)
    } else if (side === 'sell') {
      risk = utils.__toFixed(sell_risk * __percent, 6)
      actions.setSlaveSellRisk(risk)
      actions.setSlavePercentageSelected(__id, __percent)
    }

    const paradigmArray = []
    const lotSumArray = []
    for (let i = 0; i < __selected_worksheet.grid.length; i++) {
      if (i !== 0) {
        __selected_worksheet.grid[i][4].value = _.round(risk, 6)
        __selected_worksheet.grid[i][5].value = _.round(risk * __selected_worksheet.grid[i][3].value, 6)
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

  setAutoTradePercentage (e) {

    const side = this.props.side

    if (side === 'buy') {

      ___new_auto_sell_percentage(+e.target.value)

    } else if (side === 'sell') {

      ___new_auto_buy_percentage(+e.target.value)

    }

  }

  toggleAutoBuy (e) {

    const actions = this.props.chartDataActions

    if (e.target.checked) {
      actions.autoBuyToggle(true)
      ___toggle_auto_buy(true)
    } else if (!e.target.checked) {
      actions.autoBuyToggle(false)
      ___toggle_auto_buy(false)
    }

  }

  toggleAutoSell (e) {

    const actions = this.props.chartDataActions

    if (e.target.checked) {
      actions.autoSellToggle(true)
      ___toggle_auto_sell(true)
    } else if (!e.target.checked) {
      actions.autoSellToggle(false)
      ___toggle_auto_sell(false)
    }

  }

  toggleDragBuy (e) {

    const actions = this.props.chartDataActions

    if (e.target.checked) {
      actions.dragBuy(true)
    } else if (!e.target.checked) {
      actions.dragBuy(false)
    }

  }

  toggleDragSell (e) {

    const actions = this.props.chartDataActions

    if (e.target.checked) {
      actions.dragSell(true)
    } else if (!e.target.checked) {
      actions.dragSell(false)
    }

  }

  render () {

    const __self = this
    const side = this.props.side
    const auto_sell_percentage = this.props.auto_sell_percentage
    const auto_buy_percentage = this.props.auto_buy_percentage
    const auto_sell_toggle = this.props.auto_sell_toggle
    const auto_buy_toggle = this.props.auto_buy_toggle

    let percentId

    if (side === 'buy') {
      percentId = this.props.percentId
    } else if (side === 'sell') {
      percentId = this.props.slavePercentId
    }

    const percentBtns = [{
      percent: 0.01,
      id: 1,
    },{
      percent: 0.05,
      id: 5,
    },{
      percent: 0.10,
      id: 10,
    },{
      percent: 0.15,
      id: 15,
    },{
      percent: 0.20,
      id: 20,
    },{
      percent: 0.25,
      id: 25,
    },{
      percent: 0.50,
      id: 50,
    },{
      percent: 0.75,
      id: 75,
    },{
      percent: 0.80,
      id: 80,
    },{
      percent: 1,
      id: 100,
    }]

    _.each(percentBtns, function (__obj, __i) {

      if (side === 'buy') {
        percentBtns[__i].side = 'buy'
      } else if (side === 'sell') {
        percentBtns[__i].side = 'sell'
      }

    })

    function percentSelected (__id) {
      if (__id === percentId) {
        return {
          background: color.side(side),
          color: color.light,
        }
      } else {
        return {}
      }
    }

    const styles = {
      controls_wrapper: {
        width: '100%',
      },
      kick_punch_controls: {
        position: 'relative',
        width: 'calc(100% - 8px)',
        height: '100%',
        paddingLeft: 8,
        paddingTop: 0,
        paddingBottom: 0,
        float: 'left',
        overflow: 'hidden',
      },
      percent_btn_controls: {
        position: 'relative',
        float: 'left',
        width: 'calc(50% - 8px)',
        height: '90%',
        paddingTop: 4,
        paddingLeft: 4,
      },
      auto_trade_controls: {
        position: 'relative',
        float: 'left',
        width: 'calc(50% - 8px)',
        height: '90%',
        paddingTop: 4,
        paddingLeft: 4,
      },
      input: {
        width: 'calc(100% - 12px)',
        marginLeft: 0,
        textAlign: 'center',
        borderRadius: 12,
      },
      auto_trade_label: {
        textAlign: 'center',
        paddingTop: 6,
        paddingLeft: 12,
      },
      title: {
        marginLeft: -5,
        marginBottom: 8,
        marginTop: 7,
        opacity: 0.50,
        fontSize: 10,
        color: 'white',
      },
      percent_btns: {
        position: 'relative',
        float: 'left',
        fontSize: 9,
        minWidth: 24,
        height: 28,
        width: 28,
        marginLeft: 3,
        marginRight: 6,
        marginBottom: 8,
      },
      slave_risk: {
        position: 'relative',
        float: 'left',
        paddingLeft: 8,
      },
      auto_toggle_label: {
        color: '#FFFFFF !important',
        fontSize: 10,
        marginLeft: 4,
        marginBottom: 4,
        paddingTop: 3,
      },
      drag_toggle_label: {
        color: '#FFFFFF !important',
        fontSize: 10,
        marginLeft: 7,
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
      drag_toggle: {
        marginTop: 12,
        paddingTop: 3,
        borderTop: '1px solid white',
        opacity: 0.25,
      },
    }

    const __percent_btns = percentBtns.map(function (__btn, __idx) {
      return (
        <button key={__btn.id}
                id={'percentBtn_' + __btn.id}
                style={Object.assign({}, styles.percent_btns, percentSelected(__btn.id))}
                className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab"
                onClick={__self.setSlavePercentage.bind(__self, __idx, __btn.id, __btn.percent)}>
          {__btn.id}%
        </button>
      )
    })

    const auto_trade = function () {
      if (side === 'buy') {
        return (
          <div className={'pos-rel fl'}>

            <Checkbox id={'auto_sell_toggle'}
                      iconStyle={styles.icon}
                      labelStyle={styles.auto_toggle_label}
                      label={'Auto Sell %'}
                      checked={auto_sell_toggle}
                      onCheck={__self.toggleAutoSell} />

            <input id={'auto_trade_input'}
                   style={styles.input}
                   type="number"
                   step={0.05}
                   value={auto_sell_percentage}
                   onChange={__self.setAutoTradePercentage}/>

            <div style={styles.drag_toggle}></div>

            <Checkbox id={'drag_buy_toggle'}
                      iconStyle={styles.icon}
                      labelStyle={styles.drag_toggle_label}
                      label={'Drag Buy'}
                      onCheck={__self.toggleDragBuy} />

          </div>
        )
      } else if (side === 'sell') {
        return (
          <div className={'pos-rel fl'}>

            <Checkbox id={'auto_buy_toggle'}
                      iconStyle={styles.icon}
                      labelStyle={styles.auto_toggle_label}
                      label={'Auto Buy %'}
                      checked={auto_buy_toggle}
                      onCheck={__self.toggleAutoBuy} />

            <input id={'auto_trade_input'}
                   style={styles.input}
                   type="number"
                   step={0.05}
                   value={auto_buy_percentage}
                   onChange={__self.setAutoTradePercentage}/>

            <div style={styles.drag_toggle}></div>

            <Checkbox id={'drag_sell_toggle'}
                      iconStyle={styles.icon}
                      labelStyle={styles.drag_toggle_label}
                      label={'Drag Sell'}
                      onCheck={__self.toggleDragSell} />

          </div>
        )
      }
    }

    return (
      <MuiThemeProvider>

        <div style={styles.controls_wrapper}>

          <div id="kick_punch_controls" style={styles.kick_punch_controls}>

            <div style={styles.percent_btn_controls}>

              <div className="title" style={styles.title}>Sub {_.capitalize(side)} Risk %</div>

              {__percent_btns}

            </div>

            <div style={styles.auto_trade_controls}>

              {auto_trade()}

            </div>

          </div>

        </div>

      </MuiThemeProvider>
    )

  }

}

function mapStateToProps(state) {
  return {

    auto_sell_toggle: state.chartData.auto_sell_toggle,
    auto_buy_toggle: state.chartData.auto_buy_toggle,
    auto_sell_percentage: state.chartData.auto_sell_percentage,
    auto_buy_percentage: state.chartData.auto_buy_percentage,
    masterPercent: state.chartData.masterPercent,
    buy_risk: state.chartData.buy_risk,
    sell_risk: state.chartData.sell_risk,
    slave_buy_risk: state.chartData.slave_buy_risk,
    slave_sell_risk: state.chartData.slave_sell_risk,
    market: state.chartData.market,
    allMarkets: state.chartData.allMarkets,
    paradigm: state.chartData.paradigm,
    worksheet: state.chartData.worksheet,
    spreadsheet: state.chartData.spreadsheet,
    risk: state.chartData.risk,
    minTradeSize: state.chartData.minTradeSize,
    inputStep: state.chartData.inputStep,
    toggleFibOrder: state.chartData.toggleFibOrder,
    lotSumArray: state.chartData.lotSumArray,
    lotSum: state.chartData.lotSum,
    resistance_high: state.chartData.resistance_high,
    resistance_mid: state.chartData.resistance_mid,
    resistance_low: state.chartData.resistance_low,
    resistance_spread: state.chartData.resistance_spread,
    closeOffset: state.chartData.closeOffset,
    base: state.chartData.base,
    comp: state.chartData.comp,
    percentId: state.chartData.percentId,
    percent: state.chartData.percent,
    slavePercentId: state.chartData.slavePercentId,
    slavePercent: state.chartData.slavePercent,
    balances: state.chartData.balances,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PercentBtns)
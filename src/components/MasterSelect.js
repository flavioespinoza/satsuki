import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
const log = require('ololog').configure({
  locate: false
})

class MasterInput extends React.Component {


  constructor(props) {
    super(props)

    this.setMasterPercentage = this.setMasterPercentage.bind(this)

    this.state = {}

  }

  componentDidMount () {
    const actions = this.props.chartDataActions
    const side = this.props.side
    const balances = this.props.balances
    let masterPercent
    if (side === 'buy') {
      masterPercent = this.props.masterPercent
    } else if (side === 'sell') {
      masterPercent = this.props.masterCompPercent
    }
    const decimalPercent = masterPercent / 100

    let risk
    if (side === 'buy') {
      risk = utils.__toFixed(balances.base_currency.Available * decimalPercent, 8)
      actions.setBuyRisk(risk)
    } else if (side === 'sell') {
      risk = utils.__toFixed(balances.comp_currency.Available * decimalPercent, 8)
      actions.setSellRisk(risk)
    }
  }

  setMasterPercentage (e) {

    const actions = this.props.chartDataActions
    const side = this.props.side
    const balances = this.props.balances
    // const __selected_worksheet = this.props.worksheet

    let masterPercent = +e.target.parentElement.childNodes[1].innerText
    if (isNaN(masterPercent)) {
      masterPercent = +e.target.childNodes[1].innerText
    }
    const decimalPercent = masterPercent / 100
    let risk

    if (side === 'buy') {
      risk = utils.__toFixed(balances.base_currency.Available * decimalPercent, 8)
      actions.setBuyRisk(risk)
      actions.setSlaveBuyRisk(0)
      actions.setPercentageSelected(0, 0)

      actions.setMasterPercent(masterPercent)
    } else if (side === 'sell') {
      risk = utils.__toFixed(balances.comp_currency.Available * decimalPercent, 8)
      actions.setSellRisk(risk)
      actions.setSlaveSellRisk(0)
      actions.setSlavePercentageSelected(0, 0)
      actions.setMasterCompPercent(masterPercent)
    }



    // const paradigmArray = []
    // const lotSumArray = []
    // for (let i = 0; i < __selected_worksheet.grid.length; i++) {
    //   if (i !== 0) {
    //     __selected_worksheet.grid[i][4].value = _.round(risk, 9)
    //     __selected_worksheet.grid[i][5].value = _.round(risk * __selected_worksheet.grid[i][3].value, 9)
    //     paradigmArray.push(__selected_worksheet.grid[i][0].value)
    //     lotSumArray.push(__selected_worksheet.grid[i][5].value)
    //   } else {
    //     for (let c = 0; c < __selected_worksheet.grid[i].length; c++) {
    //       __selected_worksheet.grid[i][c].readOnly = true
    //     }
    //   }
    // }
    //
    // const lotSum = _.sum(lotSumArray)
    // actions.setParadigmArray(paradigmArray.reverse())
    // actions.setLotSumArray(lotSumArray)
    // actions.setLotSum(lotSum)

  }

  render() {


    const balances = this.props.balances
    const side = this.props.side
    const percentages =  [
      {
        "id": 1
      },
      {
        "id": 2
      },
      {
        "id": 3
      },
      {
        "id": 4
      },
      {
        "id": 5
      },
      {
        "id": 6
      },
      {
        "id": 7
      },
      {
        "id": 8
      },
      {
        "id": 9
      },
      {
        "id": 10
      },
      {
        "id": 11
      },
      {
        "id": 12
      },
      {
        "id": 13
      },
      {
        "id": 14
      },
      {
        "id": 15
      },
      {
        "id": 16
      },
      {
        "id": 17
      },
      {
        "id": 18
      },
      {
        "id": 19
      },
      {
        "id": 20
      },
      {
        "id": 21
      },
      {
        "id": 22
      },
      {
        "id": 23
      },
      {
        "id": 24
      },
      {
        "id": 25
      },
      {
        "id": 26
      },
      {
        "id": 27
      },
      {
        "id": 28
      },
      {
        "id": 29
      },
      {
        "id": 30
      },
      {
        "id": 31
      },
      {
        "id": 32
      },
      {
        "id": 33
      },
      {
        "id": 34
      },
      {
        "id": 35
      },
      {
        "id": 36
      },
      {
        "id": 37
      },
      {
        "id": 38
      },
      {
        "id": 39
      },
      {
        "id": 40
      },
      {
        "id": 41
      },
      {
        "id": 42
      },
      {
        "id": 43
      },
      {
        "id": 44
      },
      {
        "id": 45
      },
      {
        "id": 46
      },
      {
        "id": 47
      },
      {
        "id": 48
      },
      {
        "id": 49
      },
      {
        "id": 50
      },
      {
        "id": 51
      },
      {
        "id": 52
      },
      {
        "id": 53
      },
      {
        "id": 54
      },
      {
        "id": 55
      },
      {
        "id": 56
      },
      {
        "id": 57
      },
      {
        "id": 58
      },
      {
        "id": 59
      },
      {
        "id": 60
      },
      {
        "id": 61
      },
      {
        "id": 62
      },
      {
        "id": 63
      },
      {
        "id": 64
      },
      {
        "id": 65
      },
      {
        "id": 66
      },
      {
        "id": 67
      },
      {
        "id": 68
      },
      {
        "id": 69
      },
      {
        "id": 70
      },
      {
        "id": 71
      },
      {
        "id": 72
      },
      {
        "id": 73
      },
      {
        "id": 74
      },
      {
        "id": 75
      },
      {
        "id": 76
      },
      {
        "id": 77
      },
      {
        "id": 78
      },
      {
        "id": 79
      },
      {
        "id": 80
      },
      {
        "id": 81
      },
      {
        "id": 82
      },
      {
        "id": 83
      },
      {
        "id": 84
      },
      {
        "id": 85
      },
      {
        "id": 86
      },
      {
        "id": 87
      },
      {
        "id": 88
      },
      {
        "id": 89
      },
      {
        "id": 90
      },
      {
        "id": 91
      },
      {
        "id": 92
      },
      {
        "id": 93
      },
      {
        "id": 94
      },
      {
        "id": 95
      },
      {
        "id": 96
      },
      {
        "id": 97
      },
      {
        "id": 98
      },
      {
        "id": 99
      },
      {
        "id": 100
      }
    ]
    let masterPercent
    let origin
    let autoWidth


    if (side === 'buy') {
      masterPercent = this.props.masterPercent
      origin = { vertical: 'top', horizontal: 'left'}
      autoWidth = true
      _.each(percentages, function (__obj, __i) {
        let decimalPercent = percentages[__i].id / 100
        percentages[__i].risk =  utils.__toFixed(balances.base_currency.Available * decimalPercent, 8)
        percentages[__i].currency =  balances.base_currency.Currency
      })
    } else if (side === 'sell') {
      masterPercent = this.props.masterCompPercent
      origin = { vertical: 'top', horizontal: 'left'}
      autoWidth = false
      _.each(percentages, function (__obj, __i) {
        let decimalPercent = percentages[__i].id / 100
        percentages[__i].risk =  utils.__toFixed(balances.comp_currency.Available * decimalPercent, 8)
        percentages[__i].currency =  balances.comp_currency.Currency
      })
    }

    const menuItems = percentages.map(function (__item, __idx) {
      return (
        <MenuItem key={__idx}
                  value={__item.id}
                  primaryText={__item.id}
                  secondaryText={': ' + __item.risk + ' ' + __item.currency}
        />
      )
    })


    const styles = {
      dropDownMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 26,
        width: 26,
        padding: 0,
      },
      labelStyle: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        textAlign: 'center',
        height: 26,
        width: 42,
        borderRadius: 12,
        lineHeight: 2.6,
        fontSize: 11,
        background: 'white',
        boxShadow: 'none',
        border: 'none',
      },
      menuStyle: {
        padding: 0,
        width: 192,
      },
      menuItemStyle: {
        paddingTop: 0,
      },
      listStyle: {
        paddingTop: 0,
      },
    }

    return (

      <MuiThemeProvider>
        <DropDownMenu value={masterPercent}
                      targetOrigin={origin}
                      style={styles.dropDownMenu}
                      labelStyle={styles.labelStyle}
                      iconStyle={{display: 'none'}}
                      underlineStyle={{display: 'none'}}
                      listStyle={styles.listStyle}
                      onChange={this.setMasterPercentage}
                      menuStyle={styles.menuStyle}
                      autoWidth={autoWidth}>
          {menuItems}
        </DropDownMenu>
      </MuiThemeProvider>

    )
  }
}

function mapStateToProps (state) {
  return {

    masterPercent: state.chartData.masterPercent,
    masterCompPercent: state.chartData.masterCompPercent,
    balances: state.chartData.balances,
    worksheet: state.chartData.worksheet,
    worksheet_id: state.chartData.worksheet_id,
    percentId: state.chartData.percentId,
    slavePercentId: state.chartData.slavePercentId,
    percent: state.chartData.percent,
    slavePercent: state.chartData.slavePercent,

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
)(MasterInput);


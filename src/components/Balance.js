import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'

class Balance extends React.Component {

  render() {

    const currencyType = this.props.currencyType
    const balances = this.props.balances

    let balance
    if (currencyType === 'baseBalanceAvailable') {
      balance = utils.__toFixed(balances.base_currency.Available)
    } else if (currencyType === 'baseBalanceBalance') {
      balance = utils.__toFixed(balances.base_currency.Balance)
    }

    if (currencyType === 'compBalanceAvailable') {
      balance = utils.__toFixed(balances.comp_currency.Available)
    } else if (currencyType === 'compBalanceBalance') {
      balance = utils.__toFixed(balances.comp_currency.Balance)
    }

    return (
      <div>{utils.__toFixed(balance, null, 2, 8)}</div>
    )
  }
}

function mapStateToProps (state) {
  return {
    balances: state.chartData.balances,
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
)(Balance);



import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'


class Currency extends React.Component {

  render() {

    let currency
    const balances = this.props.balances
    const currencyType = this.props.currencyType

    if (currencyType === 'baseCurrency') {
      currency = balances.base_currency.Currency
    } else if (currencyType === 'compCurrency') {
      currency = balances.comp_currency.Currency
    }

    return (
      <div>{currency}</div>
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
)(Currency);


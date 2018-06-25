
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'

class RiskAmount extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {

    const riskSide = this.props.riskSide
    let buy_risk = this.props.buy_risk
    let sell_risk = this.props.sell_risk
    let risk

    if (riskSide === 'buyRisk') {
      risk = buy_risk
    } else if (riskSide === 'sellRisk') {
      risk = sell_risk
    }

    return (
      <div className="title">Risk: {utils.__toFixed(risk, null, 2, 8)}</div>
    )
  }
}

function mapStateToProps (state) {
  return {
    buy_risk: state.chartData.buy_risk,
    sell_risk: state.chartData.sell_risk,
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
)(RiskAmount);



import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as chartDataActions from '../actions/chartDataActions'
import store from '../Store'

const btnStyle = {
  width: 60
}

class Choice extends React.Component {

  handleRisk () {

    let risk = this.props.risk
    let base = this.props.base
    let comp = this.props.comp

    if (risk === base) {
      store.dispatch({type: 'SET_RISK', payload: comp})
    } else if (risk === comp) {
      store.dispatch({type: 'SET_RISK', payload: base})
    } else {
      console.error('handleRisk Error: components/ParadigmList.js')
    }

  }

  handleSide () {

    let side = this.props.side

    if (side === 'buy') {
      store.dispatch({type: 'SET_SIDE', payload: 'sell'})
    } else if (side === 'sell') {
      store.dispatch({type: 'SET_SIDE', payload: 'buy'})
    } else {
      console.error('handleSide Error: components/ParadigmList.js')
    }
  }

  handleDivision (e) {
    console.log('e', e.target.value)
    let riskAmount = e.target.value
    let paradigm = this.props.paradigm
    let riskDivision = e.target.value / paradigm.length

    store.dispatch({type: 'SET_RISK_AMOUNT', payload: riskAmount})
    store.dispatch({type: 'SET_RISK_DIVISION', payload: riskDivision})
  }

  render() {

    const base = this.props.base
    const comp = this.props.comp
    let side = this.props.side
    let risk = this.props.risk
    let riskAmount = this.props.riskAmount
    let riskDivision = this.props.riskDivision
    let riskPercentage
    let baseAmount = this.props.baseAmount

    return (

      <div>
        <div className="p12">I want to<button className="ml12 uppercase" style={btnStyle} onClick={this.handleSide.bind(this)} defaultValue={side}></button><input style={btnStyle} className="ml8 mr8" type="number" onChange={this.handleDivision.bind(this)} /><div style={btnStyle}>{comp}</div></div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    paradigm: state.chartData.paradigm,
    balances: state.chartData.balances,
    base: state.chartData.base,
    comp: state.chartData.comp,
    side: state.chartData.side,
    risk: state.chartData.risk,
    baseAmount: state.chartData.baseAmount,
    riskAmount: state.chartData.riskAmount,
    riskDivision: state.chartData.riskDivision,
  }
}

function mapDispatchToProps(dispatch) {
  // this function will now give you access to all your chartDataActions by simply calling this.props.actions.
  return {
    actions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Choice);



import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions/chartDataActions'
import * as utils from '../utils'

import _ from 'lodash'
const color = utils.color()
const log = require('ololog').configure({
  locate: false
})



class AutoTrade extends React.Component {

  constructor(props) {
    super(props)


    this.setMaLength = this.setMaLength.bind(this)

    this.state = {
      message: 'waiting for heartbeat',
      value: 0,
      percentBtnSelected: 0,
    }

  }


  setMaLength (e) {
    const actions = this.props.chartDataActions
    const ma_length = +e.target.value
    actions.setMaLength(ma_length)

  }

  render() {


    const ma_length = this.props.ma_length

    const __style = {
      label: {
        width: 'calc(25%)',
        marginLeft: 0,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
      },
      input: {
        width: 'calc(25%)',
        marginLeft: 0,
        textAlign: 'center',
        borderRadius: 12,
      },

    }

    return (
      <div>

        <div className="title" style={__style.label}>Volume MA Length</div>

        <input id="ma_length_input"
               style={__style.input}
               type="number"
               step={1}
               value={ma_length}
               onChange={this.setMaLength}
        />

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    ma_length: state.chartData.ma_length,
    data: state.chartData.candleData,
    market_summary: state.chartData.market_summary,
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
)(AutoTrade)
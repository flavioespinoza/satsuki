import React from 'react'
import store from '../Store'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'

const styles = {
  block: {
    maxWidth: 250
  },
  radioButton: {
    marginBottom: 6,
    fontSize: 11
  }
}

class OrderSide extends React.Component {

  componentWillMount () {

  }

  changeSide (e, __new_side) {
    console.log('__new_side', JSON.stringify(__new_side, null, 2))
    store.dispatch({type: 'SET_SIDE', payload: __new_side})
    store.dispatch({type: 'SET_OPEN_TYPE', payload: __new_side})
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>

          <RadioButtonGroup
            name="Side"
            className="r-button side-group"
            defaultSelected={this.props.side}
            onChange={this.changeSide.bind(this)}>
            <RadioButton
              className="radio"
              value='buy'
              label='LIMIT_BUY'
              style={styles.radioButton}
            />
            <RadioButton
              className="radio"
              value="sell"
              label="LIMIT_SELL"
              style={styles.radioButton}
            />
          </RadioButtonGroup>

        </div>
      </MuiThemeProvider>
    )
  }

}

function mapStateToProps (state) {
  return {
    side: state.chartData.side,
    orderType: state.chartData.orderType,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderSide)
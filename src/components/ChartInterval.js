import React from 'react'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chartDataActions from '../actions/chartDataActions'
import { ___new_chart_interval } from '../index'


const styles = {
  block: {
    maxWidth: 250
  },
  radioButton: {
    marginBottom: 6,
    fontSize: 11
  }
}

class ChartInterval extends React.Component {
  constructor (props) {
    super(props)
    this.changeInterval = this.changeInterval.bind(this)
    this.state = {}
  }

  changeInterval (e, __new_chart_interval) {
    ___new_chart_interval(__new_chart_interval)
  }

  render () {

    let { interval } = this.props

    return (
      <MuiThemeProvider>

        <div>

          <RadioButtonGroup name="chartIntervals"
                            className="r-button"
                            defaultSelected={interval}
                            onChange={this.changeInterval}>

            <RadioButton className="radio"
                         value="oneMin"
                         label="1m"
                         style={styles.radioButton}/>

            <RadioButton className="radio"
                         value="fiveMin"
                         label="5m"
                         style={styles.radioButton}/>

            <RadioButton className="radio"
                         value="fifteenMin"
                         label="15m"
                         style={styles.radioButton}/>

            <RadioButton className="radio"
                         value="thirtyMin"
                         label="30m"
                         style={styles.radioButton}/>

            <RadioButton className="radio"
                         value="hour"
                         label="1 hr"
                         style={styles.radioButton}/>

            <RadioButton className="radio"
                         value="day"
                         label="1 day"
                         style={styles.radioButton}/>

          </RadioButtonGroup>

        </div>

      </MuiThemeProvider>
    )
  }

}

function mapStateToProps(state) {
  return {
    interval: state.chartData.interval,
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
)(ChartInterval);
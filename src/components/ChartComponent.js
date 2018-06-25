
import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'

import TypeChooser  from "./TypeChooser";
import Chart from '../reference/Chart_x'

class ChartComponent extends React.Component {

  componentWillMount() {

  }

  render() {
    const { data, orders, height, margins, interval, market } = this.props
    return (
      <TypeChooser>
        {type => <Chart
          type={type}
          height={height}
          margins={margins}
          data={data}
          orders={orders}
          interval={interval}
          market={market}
        />}
      </TypeChooser>
    )
  }

}

function mapStateToProps(state) {
  return {
    data: state.chartData.candleData,
    height: 720,
    margins: { left: 12, right: 56, top: 0, bottom: 0 },
    interval: state.chartData.interval,
    market: state.chartData.market,
    orders: state.chartData.openOrders,
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
)(ChartComponent);


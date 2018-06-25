
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as chartDataActions from '../actions/chartDataActions'

class MarketFavorites extends React.Component {

  componentWillMount() {

  }

  render() {

    const marketFavorites = this.props['']

    return (
      <div>{marketFavorites}</div>
    )
  }
}

function mapStateToProps(state) {
  return {
    marketFavorites: state.chartData.marketFavorites
  }
}

function mapDispatchToProps(dispatch) {
  // this function will now give you access to all your MarketFavorites by simply calling this.props.actions.
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketFavorites);


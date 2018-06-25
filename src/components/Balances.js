import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
const log = require('ololog').configure({
  locate: false
})


class Balances extends Component {
  constructor (props) {
    super(props)

    this.copyToClipboard = this.copyToClipboard.bind(this)

    this.state = {}

  }

  copyToClipboard (__info_val) {
    utils.copy(__info_val)
    const snackbarContainer = document.getElementById('snackbarBottom')
    const handler = function (e) {
      // console.log('e', e)
    }
    const data = {
      message: 'Copied to clipboard! :)',
      timeout: 1800,
      actionHandler: handler,
      actionText: 'Close'
    }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
  }

  render () {

    const styles = {
      balances_wrapper: {
        position: 'relative',
        paddingLeft: 6,
        paddingBottom: 8,
      },
      balances_ul: {
        overflow: 'hidden',
        padding: 0,
      },
      balances_row: {
        position: 'relative',
        width: 'calc(100% / 3.25)',
        height: 18,
        float: 'left',
        marginRight: 4,
        paddingLeft: 6,
        // background: 'lightgreen',
      },
      balances_title: {
        marginBottom: '0 !important',
        paddingBottom: '0 !important',
      },
    }
    const balances = this.props.balances

    return (

      <div id={'balances_wrapper'}
           style={styles.balances_wrapper}>

          <ul style={styles.balances_ul} className="balances">

            <li className={'pt0'}>

              <div style={Object.assign({}, styles.balances_row, styles.balances_title)} className={'title'}>

                {'Currency'}

              </div>
              <div style={Object.assign({}, styles.balances_row, styles.balances_title)} className={'title'}>

                {'Available'}

              </div>
              <div style={Object.assign({}, styles.balances_row, styles.balances_title)} className={'title'}>

                {'Balance'}

              </div>

            </li>

            <li>

              <div style={styles.balances_row}>

                {balances.base_currency.Currency}

              </div>
              <div style={styles.balances_row}
                   className={'copy'}
                   onClick={() => this.copyToClipboard(utils.__toFixed(balances.base_currency.Available, 9))}>

                {utils.__toFixed(balances.base_currency.Available, 9)}

              </div>
              <div style={styles.balances_row}
                   className={'copy'}
                   onClick={() => this.copyToClipboard(utils.__toFixed(balances.base_currency.Balance, 9))}>

                {utils.__toFixed(balances.base_currency.Balance, 9)}

              </div>

            </li>

            <li>

              <div style={styles.balances_row}>

                {balances.comp_currency.Currency}

              </div>
              <div style={styles.balances_row}
                   className={'copy'}
                   onClick={() => this.copyToClipboard(utils.__toFixed(balances.comp_currency.Available, 9))}>

                {utils.__toFixed(balances.comp_currency.Available, 9)}

              </div>
              <div style={styles.balances_row}
                   className={'copy'}
                   onClick={() => this.copyToClipboard(utils.__toFixed(balances.comp_currency.Balance, 9))}>

                {utils.__toFixed(balances.comp_currency.Balance, 9)}

              </div>

            </li>

          </ul>

      </div>

    )
  }
}

function mapStateToProps (state) {
  return  {
    risk: state.chartData.risk,
    balances: state.chartData.balances,
  }
}

function mapDispatchToProps (dispatch) {
  // this function will now give you access to all your chartDataActions by simply calling this.props.actions.
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balances)
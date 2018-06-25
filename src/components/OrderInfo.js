import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as chartDataActions from '../actions/chartDataActions';
import * as utils from '../utils'
import _ from 'lodash'
const color = utils.color()
const log = require('ololog').configure({
  locate: false
})

class OrderInfo extends React.Component {

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

    let ___price = 7446.27

    const order_info = this.props.orderInfo

    const orderInfo = _.map(order_info, function (__val, __key) {
      return {
        key: __key,
        val: __val,
      }
    })

    let order_info_model = {
      'id': false,
      'info': false,
      'timestamp': false,
      'datetime': false,
      'status': false,
      'symbol': false,
      'type': false,
      'side': false,
      'price': false,
      'average': false,
      'cost': false,
      'amount': false,
      'filled': false,
      'remaining': false,
      'fee': false,
      'selected': false,
      'start': false,
      'end': false,
      'appearance': false,
      'commission': false,
      'total_return': false,
    }

    if (order_info.status === 'closed') {

      order_info_model = {
        'status': true,
        'average': true,
        'cost': true,
        'filled': true,
        'commission': true,
        'total_return': true,
      }

    } else if (order_info.status === 'partial') {

      order_info_model = {
        'status': true,
        'price': true,
        'amount': true,
        'filled': true,
        'remaining': true,
      }

    } else {

      order_info_model = {
        'status': true,
        'price': true,
        'amount': true,
      }

    }

    let side = _.find(orderInfo, {key: 'side'})

    let textColor

    if (side) {
      textColor = color.side_rgb(side.val, 0.90)
    } else {
      textColor = '#9E9E9E'
    }

    const __order_info = orderInfo.map((__info_list_item, __idx) => {

      const __key = order_info_model[__info_list_item.key]

      if (!__key) {

        return

      } else {

        let info_val

        if (!__info_list_item.val) {
          info_val = '...'
        } else {
          info_val = utils.__toFixed(__info_list_item.val, null, 2, 8)
        }

        return (
          <li key={__idx} className="p0">

            <div style={{ fontSize: 10, color: '#9E9E9E', marginBottom: 4 }}>{__info_list_item.key}</div>

            <div style={{ fontSize: 14, color: textColor, marginTop: -9 }}
                 className={'copy'}
                 onClick={() => {this.copyToClipboard(info_val)}} >
              {info_val}
            </div>

          </li>
        )
      }

    })

    return (
      <ul className="md-list">{__order_info}</ul>
    )

  }
}

function mapStateToProps(state) {
  return {
    orderInfo: state.chartData.orderInfo,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderInfo);
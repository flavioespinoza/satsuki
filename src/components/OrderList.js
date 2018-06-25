import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import { ___cancel_single_order } from '../index'
import _ from 'lodash'
import Chance from 'chance'
const chance = new Chance()
const log = require('ololog').configure({
  locate: false
})
const color = utils.color()

class OrderList extends React.Component {

  constructor(props) {
    super(props)

    this.setOrderInfo = this.setOrderInfo.bind(this)
    this.cancelSingleOrder = this.cancelSingleOrder.bind(this)

    this.state = {}

  }

  cancelSingleOrder(__order) {
    const actions = this.props.chartDataActions
    actions.setOrderSelected(__order.id)
    setTimeout(function () {
      actions.setOrderInfo({
        start: null,
        end: null,
      })
    }, 200)
    ___cancel_single_order (__order)
  }


  setOrderInfo(__order) {

    const actions = this.props.chartDataActions
    actions.setOrderInfo(__order)
    actions.setOrderSelected(__order.id)

  }

  render () {

    const __self = this
    const open_buy_orders = this.props.open_buy_orders
    const open_sell_orders = this.props.open_sell_orders
    const open_orders = _.reverse(_.sortBy(open_sell_orders.concat(open_buy_orders), 'price'))
    const order_selected = this.props.orderSelected

    const order_list = open_orders.map(function (__obj) {

      const text = utils.__toFixed(__obj.amount, null, 2, 8) + ' @ ' + utils.__toFixed(__obj.price, null, 2, 8)
      const quid = chance.guid()

      const style = {
        li: {
          backgroundColor: color.side_rgb(__obj.side, 0.6),
          color: 'white',
          cursor: 'pointer',
        }
      }

      if (__obj.id === order_selected) {
        style.li.backgroundColor = '#FF8200'
      }

      return (
        <li className={'mdl-list__item pos-rel'}
            key={quid}
            style={style.li}
            onClick={() => {__self.setOrderInfo(__obj)}}>

          <div>
            {text}
          </div>

          <button className={'mdl-button mdl-js-button mdl-button--icon'} onClick={() => {__self.cancelSingleOrder(__obj)}}>
            <i className={'material-icons cancel-order-btn'}>close</i>
          </button>

        </li>
      )
    })

    return (
      <ul className={'mdl-list m0 p0'}>{order_list}</ul>
    )

  }
}

function mapStateToProps (state) {
  return {

    open_buy_orders: state.chartData.open_buy_orders,
    open_sell_orders: state.chartData.open_sell_orders,
    selected: state.chartData.selected,
    orderSelected: state.chartData.orderSelected,

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
)(OrderList)


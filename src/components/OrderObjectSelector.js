'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { isDefined, noop, mapObject, head } from 'react-stockcharts/lib/utils/index'
import { getMorePropsForChart, getSelected } from 'react-stockcharts/lib/interactive/utils'

import GenericComponent, { getMouseCanvas } from 'react-stockcharts/lib/GenericComponent'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'

import * as utils from '../utils'
import _ from 'lodash'

const log = require('ololog').configure({
  locate: false
})

class OrderObjectSelector extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.getInteraction = this.getInteraction.bind(this)
    this.setSelected = this.setSelected.bind(this)
  }

  handleDoubleClick(moreProps, e) {
    e.preventDefault()
    const {
      onDoubleClick
    } = this.props
    const {
      enabled
    } = this.props
    if (!enabled) return
    const interactives = this.getInteraction(moreProps)
    const selected = getSelected(interactives)
    if (selected.length > 0) {
      const item = head(selected)
      const morePropsForChart = getMorePropsForChart(moreProps, item.chartId)
      onDoubleClick(item, morePropsForChart)
    }
  }

  setSelected (e) {

  }

  handleClick(moreProps, e) {
    const actions = this.props.chartDataActions
    const openOrders = this.props.openOrders
    const selected = this.props.selected
    // if (e.target.className.baseVal === 'react-stockcharts-move-cursor') {
    //   const {
    //     mouseXY: [, mouseY],
    //     xAccessor,
    //     currentItem
    //   } = moreProps
    //   const yScale = moreProps.chartConfig[0].yScale
    //   const __x = xAccessor(currentItem)
    //   const xPositions = openOrders.map(function(__obj) {
    //     return __obj.position[0]
    //   })
    //   const __xClosest = utils.closest(xPositions, __x)
    //   const __all_xPositions = []
    //   for (let i = 0; i < openOrders.length; i++) {
    //     if (openOrders[i].position[0] === __xClosest) {
    //       __all_xPositions.push(openOrders[i])
    //     }
    //   }
    //   const yPositions = __all_xPositions.map(function(__obj) {
    //     return __obj.position[1]
    //   })
    //   const __y = yScale.invert(mouseY)
    //   const __yClosest = utils.closest(yPositions, __y)
    //   const selectedOrder = _.find(__all_xPositions, function(__obj) {
    //     return __obj.position[1] === __yClosest
    //   })
    //   const idx = _.findIndex(openOrders, function(__obj) {
    //     return __obj.id === selectedOrder.id
    //   })
    //   if (openOrders[idx]) {
    //     openOrders[idx].selected = true
    //     actions.setAllOrders(openOrders)
    //     selected.push(openOrders[idx])
    //     actions.setSelected(selected)
    //     // console.log('___selected', selected)
    //   }
    // }


    // e.preventDefault()
    // const {
    //   onSelect
    // } = this.props
    // const {
    //   enabled
    // } = this.props
    // if (!enabled) return
    // const interactives = this.getInteraction(moreProps)
    // onSelect(interactives, moreProps)


  }

  getInteraction(moreProps) {
    const {
      getInteractiveNodes,
      drawingObjectMap
    } = this.props
    const interactiveNodes = getInteractiveNodes()
    // console.log('interactiveNodes', interactiveNodes)
    const interactives = mapObject(interactiveNodes, each => {
      const key = drawingObjectMap[each.type]

      let valueArray
      if (isDefined(key)) {
        if (each) {
          if (each.node) {
            if (each.node.props) {
              valueArray = each.node.props[key]
            }
          }
        }
      } else {
        valueArray = undefined
      }

      const valuePresent = isDefined(valueArray) && Array.isArray(valueArray) && valueArray.length > 0
      if (valuePresent) {
        // console.log('Value present for ', each.type, each.chartId)
        const morePropsForChart = getMorePropsForChart(moreProps, each.chartId)
        const objects = each.node.getSelectionState(morePropsForChart)
        return {
          type: each.type,
          chartId: each.chartId,
          objects
        }
      }
      return {
        type: each.type,
        chartId: each.chartId,
        objects: []
      }
    })
    // console.log('interactives', interactives)
    return interactives
  }

  render () {
    return (
      <GenericComponent
        svgDraw={noop}
        canvasToDraw={getMouseCanvas}
        canvasDraw={noop}

        onMouseDown={this.handleClick}
        onDoubleClick={this.handleDoubleClick}

        drawOn={['mousemove', 'pan', 'drag']}
      />
    )
  }
}

OrderObjectSelector.propTypes = {
  getInteractiveNodes: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  drawingObjectMap: PropTypes.object.isRequired,
  enabled: PropTypes.bool.isRequired
}

OrderObjectSelector.defaultProps = {
  enabled: true,
  onDoubleClick: noop
}

function mapStateToProps (state) {
  return {
    openOrders: state.chartData.openOrders,
    textList_1: state.chartData.textList_1,
    orderHistory: state.chartData.orderHistory,
    orderHistoryList_1: state.chartData.orderHistoryList_1,
    allOrders: state.chartData.allOrders,
    selected: state.chartData.selected,
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
)(OrderObjectSelector)
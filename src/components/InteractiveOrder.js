
import React from 'react'

import * as chartDataActions from '../actions/chartDataActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import GenericChartComponent from 'react-stockcharts/lib/GenericChartComponent'
import { getMouseCanvas } from 'react-stockcharts/lib/GenericComponent'
import { isDefined, noop, hexToRGBA } from 'react-stockcharts/lib/utils'
import InteractiveText from './InterativeText'

class InteractiveOrder extends React.Component {

  constructor (props) {
    super(props)


  }

  componentWillReceiveProps (nextProps) {
    this.calculateTextWidth = (
      nextProps.text !== this.props.text
      || nextProps.fontStyle !== this.props.fontStyle
      || nextProps.fontWeight !== this.props.fontWeight
      || nextProps.fontSize !== this.props.fontSize
      || nextProps.fontFamily !== this.props.fontFamily
    )
  }

  renderSVG () {

  }

  drawOnCanvas (ctx, moreProps) {
    const {
      bgFill,
      bgOpacity,
      textFill,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      text
    } = this.props

    if (this.calculateTextWidth) {
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
      const {width} = ctx.measureText(text)
      this.textWidth = width
      this.calculateTextWidth = false
    }

    const {selected} = this.props

    const {x, y, rect} = helper(this.props, moreProps, this.textWidth)

    ctx.fillStyle = bgFill
    ctx.beginPath()
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)

    if (selected) {
      ctx.strokeStyle = textFill
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
    }

    ctx.fillStyle = textFill
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

    ctx.beginPath()
    ctx.fillText(text, x, y)

  }

  isHover () {

  }

  notHovering () {

  }

  dragStarted () {

  }

  isDragging () {

  }

  dragComplete () {

  }

  renderSVG () {
    throw new Error('svg not implemented')
  }

  render () {

    let __self = this
    const orders = __self.props.orders
    console.log('orders', orders)

    const {
      position,
      bgFill,
      bgOpacity,
      textFill,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      text,
      textWidth,
      hoverText,
      selected,
      onDragComplete,
    } = this.props;


    let __interactive_orders = orders.map(function (__order, __idx) {


      return (
        <GenericChartComponent key={__idx}

                               isHover={__self.isHover.bind(__self)}

                               svgDraw={__self.renderSVG.bind(__self)}
                               canvasToDraw={getMouseCanvas.bind(__self)}
                               canvasDraw={__self.drawOnCanvas.bind(__self)}

                               bgFill ={__order.bgFill}
                               bgOpacity={__order.bgOpacity}
                               textFill={__order.textFill}
                               fontFamily={__order.fontFamily}
                               fontSize={__order.fontSize}
                               fontWeight={__order.fontweight}
                               fontStyle={__order.fontStyle}
                               text={__order.text}
                               textWidth={12}
                               position ={__order.position}

                               canvasToDraw={getMouseCanvas}
                               interactiveCursorClass="interactive-order"
                               selected={__order.selected}
                               onDragStart={__self.dragStarted.bind(__self)}
                               onDrag={__self.isDragging.bind(__self)}
                               onDragComplete={__self.dragComplete.bind(__self)}
                               drawOn={['mousemove', 'mouseleave', 'pan', 'drag']}/>
      )

    })

    return (<g>{__interactive_orders}</g>)
  }
}

function helper (props, moreProps, textWidth) {

  const {position, fontSize} = props

  const {xScale, chartConfig: {yScale}} = moreProps

  const [xValue, yValue] = position
  const x = xScale(xValue)
  const y = yScale(yValue)

  const rect = {
    x: x - textWidth / 2 - fontSize,
    y: y - fontSize,
    width: textWidth + fontSize * 2,
    height: fontSize * 2
  }

  return {
    x, y, rect
  }
}

InteractiveOrder.propTypes = {

  bgFill: PropTypes.string.isRequired,
  bgOpacity: PropTypes.number.isRequired,

  textFill: PropTypes.string.isRequired,
  fontFamily: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,

  text: PropTypes.string.isRequired,

  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,

  defaultClassName: PropTypes.string,
  interactiveCursorClass: PropTypes.string,

  tolerance: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired
}

InteractiveOrder.defaultProps = {
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,

  bgFill: 'black',
  bgOpacity: 1,

  textFill: 'white',
  fontFamily: 'Helvetica nue',
  fontSize: 12,
  text: 'loading...',

  type: 'SD', // standard dev
  fontWeight: 'normal', // standard dev

  strokeWidth: 1,
  tolerance: 4,
  selected: false
}


function mapStateToProps (state) {
  return {
    orders: state.chartData.openOrders,
    orderHistory: state.chartData.orderHistory,
    interval: state.chartData.interval,
    market: state.chartData.market,
    symbol: state.chartData.symbol,
    side: state.chartData.side,
    orderType: state.chartData.orderType,
    position: [],
    selected: false,
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
)(InteractiveOrder)
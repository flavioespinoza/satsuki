import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'
import displayValuesFor from 'react-stockcharts/lib/tooltip/displayValuesFor'
import GenericChartComponent from 'react-stockcharts/lib/GenericChartComponent'

import { isDefined, functor } from 'react-stockcharts/lib/utils'
import ToolTipText from 'react-stockcharts/lib/tooltip/ToolTipText'
import ToolTipTSpanLabel from 'react-stockcharts/lib/tooltip/ToolTipTSpanLabel'

const to_decimal = 3
const _exp = function (num, to_decimal) {
  let notation = num.toExponential(to_decimal)
  return notation.split('e')
}
const _exp2 = function (num, to_decimal) {
  let _num = +num
  let notation = _num.toExponential(to_decimal)
  return notation.split('e')[1]
}

class OHLCTooltip extends Component {
  constructor (props) {
    super(props)
    this.renderSVG = this.renderSVG.bind(this)
  }

  renderSVG (moreProps) {
    const {displayValuesFor} = this.props
    const {
      xDisplayFormat,
      accessor,
      volumeFormat,
      ohlcFormat,
      percentFormat,
      displayTexts
    } = this.props

    const {chartConfig: {width, height}} = moreProps
    const {displayXAccessor} = moreProps

    const currentItem = displayValuesFor(this.props, moreProps)

    let displayDate, open, high, low, close, volume, percent, exponent
    displayDate = open = high = low = close = volume = percent = exponent = displayTexts.na

    if (isDefined(currentItem) && isDefined(accessor(currentItem))) {
      const item = accessor(currentItem)

      exponent = _exp2(currentItem.close, to_decimal)
      // console.log('exponent', exponent)

      volume = isDefined(item.volume) ? volumeFormat(item.volume) : displayTexts.na
      displayDate = xDisplayFormat(displayXAccessor(item))
      open = ohlcFormat(item.open)
      high = ohlcFormat(item.high)
      low = ohlcFormat(item.low)
      close = ohlcFormat(item.close)
      percent = percentFormat((item.close - item.open) / item.open)
    }

    const {origin: originProp} = this.props
    const origin = functor(originProp)
    const [x, y] = origin(width, height)

    const itemsToDisplay = {
      displayDate,
      exponent,
      open,
      high,
      low,
      close,
      percent,
      volume,
      x,
      y
    }
    return this.props.children(this.props, moreProps, itemsToDisplay)
  }

  render () {
    return (
      <GenericChartComponent
        clip={false}
        svgDraw={this.renderSVG}
        drawOn={['mousemove']}
      />
    )
  }
}

OHLCTooltip.propTypes = {
  className: PropTypes.string,
  accessor: PropTypes.func,
  xDisplayFormat: PropTypes.func,
  children: PropTypes.func,
  volumeFormat: PropTypes.func,
  percentFormat: PropTypes.func,
  ohlcFormat: PropTypes.func,
  origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  onClick: PropTypes.func,
  displayValuesFor: PropTypes.func,
  textFill: PropTypes.string,
  labelFill: PropTypes.string,
  displayTexts: PropTypes.object
}

const displayTextsDefault = {
  d: ': ',
  e: ' Exp: ',
  o: '  O: ',
  h: '  H: ',
  l: '  L: ',
  c: '  C: ',
  v: '  Vol: ',
  na: 'n/a'
}


OHLCTooltip.defaultProps = {

  accessor: d => {

    return {
      date: d.date,
      exp: d.close,
      open: _exp(d.open, to_decimal)[0],
      high: _exp(d.high, to_decimal)[0],
      low: _exp(d.low, to_decimal)[0],
      close: _exp(d.close, to_decimal)[0],
      volume: d.volume
    }
  },
  xDisplayFormat: timeFormat('%b %e, %_I:%M %p - '),
  volumeFormat: format('.4s'),
  percentFormat: format('.2%'),
  ohlcFormat: format('.3f'),
  displayValuesFor: displayValuesFor,
  origin: [0, 0],
  children: defaultDisplay,
  displayTexts: displayTextsDefault
}

function defaultDisplay (props, moreProps, itemsToDisplay) {

  /* eslint-disable */
  const {
    className,
    textFill,
    labelFill,
    onClick,
    fontFamily,
    fontSize,
    displayTexts
  } = props
  /* eslint-enable */

  const {
    displayDate,
    exponent,
    open,
    high,
    low,
    close,
    volume,
    x,
    y
  } = itemsToDisplay
  return (
    <g className={`react-stockcharts-tooltip-hover ${className}`}
       transform={`translate(${x}, ${y})`}
       onClick={onClick}>

      <ToolTipText x={0}
                   y={0}
                   fontFamily={fontFamily}
                   fontSize={fontSize}>

        {/*<ToolTipTSpanLabel fill={labelFill}*/}
                           {/*key="label"*/}
                           {/*x={0}*/}
                           {/*dy="5">{displayTexts.d}</ToolTipTSpanLabel>*/}

        {/*<tspan key="value" fill={textFill}>{displayDate}</tspan>*/}

        <ToolTipTSpanLabel fill={labelFill} key="label_Exp">[ {displayTexts.e} {exponent} ]</ToolTipTSpanLabel>

        <ToolTipTSpanLabel fill={labelFill} key="label_O">{displayTexts.o}</ToolTipTSpanLabel>
        <tspan key="value_O" fill={textFill}>{open}</tspan>
        <ToolTipTSpanLabel fill={labelFill} key="label_H">{displayTexts.h}</ToolTipTSpanLabel>
        <tspan key="value_H" fill={textFill}>{high}</tspan>
        <ToolTipTSpanLabel fill={labelFill} key="label_L">{displayTexts.l}</ToolTipTSpanLabel>
        <tspan key="value_L" fill={textFill}>{low}</tspan>
        <ToolTipTSpanLabel fill={labelFill} key="label_C">{displayTexts.c}</ToolTipTSpanLabel>
        <tspan key="value_C" fill={textFill}>{close}</tspan>
        <ToolTipTSpanLabel fill={labelFill} key="label_Vol">{displayTexts.v}</ToolTipTSpanLabel>
        <tspan key="value_Vol" fill={textFill}>{volume}</tspan>

      </ToolTipText>
    </g>
  )
}

export default OHLCTooltip
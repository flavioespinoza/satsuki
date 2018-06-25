import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import ChartCanvas from '../lib/ChartCanvas'
import Chart from '../lib/Chart'

import {
  CandlestickSeries,
  LineSeries,
  BarSeries,
  AreaSeries,
} from '../lib/series'

import XAxis from 'react-stockcharts/lib/axes/XAxis'
import YAxis from './YAxis'

import {
  CrossHairCursor,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
  PriceCoordinate
} from '../lib/coordinates'

import Last from '../lib/coordinates/PriceCoordinate'
import Bid from '../lib/coordinates/PriceCoordinate'
import Ask from '../lib/coordinates/PriceCoordinate'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
 import { ema, macd, rsi, sma, atr } from "react-stockcharts/lib/indicator";

import DrawingObjectSelector from '../lib/interactive/DrawingObjectSelector'

import FibOrders from '../lib/interactive/FibonacciRetracement'

import Drag__BuyOrder from '../lib/interactive/TrendLine'
import Open__BuyOrder__Marker from '../lib/coordinates/OpenOrderMarker'

import Drag__SellOrder from '../lib/interactive/TrendLine'
import Open__SellOrder__Marker from '../lib/coordinates/OpenOrderMarker'

import Closed__BuyOrders from '../lib/coordinates/OrderHistoryMarker'
import Closed__SellOrders from '../lib/coordinates/OrderHistoryMarker'

import { fitWidth } from 'react-stockcharts/lib/helper'
import { last, toObject } from 'react-stockcharts/lib/utils'
import {
  saveInteractiveNodes,
  getInteractiveNodes
} from './interactiveutils'
import { InteractiveText } from '../lib/interactive'
import { getMorePropsForChart } from 'react-stockcharts/lib/interactive/utils'
import { head } from 'react-stockcharts/lib/utils/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
import Chance from 'chance'

const chance = new Chance()
const log = require('ololog').configure({
  locate: false
})

class ChartFib extends React.Component {

  constructor (props) {
    super(props)

    this.onFibComplete1 = this.onFibComplete1.bind(this)

    this.saveInteractiveNodes = saveInteractiveNodes.bind(this)
    this.getInteractiveNodes = getInteractiveNodes.bind(this)

    this.saveCanvasNode = this.saveCanvasNode.bind(this)
    this.handleReset = this.handleReset.bind(this)

    this.saveNode = this.saveNode.bind(this)
    this.resetYDomain = this.resetYDomain.bind(this)

    this.handleSelection = this.handleSelection.bind(this)
    this.handleChoosePosition = this.handleChoosePosition.bind(this)
    this.onDrawComplete = this.onDrawComplete.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)

    this.onKeyPress = this.onKeyPress.bind(this)

    this.placeNewOrder = this.placeNewOrder.bind(this)

    this.handleDoubleClick = this.handleDoubleClick.bind(this)

    this.onOpenOrderDragComplete = this.onOpenOrderDragComplete.bind(this)
    this.onOpenOrderSelect = this.onOpenOrderSelect.bind(this)

    log.red('constructor 2')

    this.state = {

      enableFib: false,
      retracements_1: [],

      enableOrderMarker: false,
      textList_1: [],

      enableOrderHistoryMarker: false,
      orderHistoryList_1: [],

      enableRuler: false,
      rulers: [],

      enableInteractiveObject: false,
      interactiveText_1: [],

      chartHeight: 1200,

      enableTrendLine: false,
      trends_1: [],

      __timestamp: null

    }

  }

  componentDidMount () {
    const __self = this
    const actions = this.props.chartDataActions
    const openOrders = this.props.openOrders
    
    document.addEventListener('keyup', __self.onKeyPress)

    const chartHeight = document.getElementById('chart').clientHeight

    this.setState({
      chartHeight: chartHeight
    })

    const allOrders = this.props.openOrders.concat(this.props.orderHistory)
    actions.setAllOrders(allOrders)

  }

  componentWillUnmount () {
    console.log('this.props.toggleFibOrder', this.props.toggleFibOrder)
    document.removeEventListener('keyup', this.onKeyPress)

  }

  onFibComplete1 (retracements_1) {
    const actions = this.props.chartDataActions

    this.setState({
      retracements_1,
      enableFib: false
    })
    actions.setRetracements_1(retracements_1)
    actions.enableFib(false)
  }

  saveCanvasNode (node) {
    this.canvasNode = node

  }

  handleReset () {
    this.setState({
      suffix: this.state.suffix + 1
    })
  }

  saveNode (node) {
    this.node = node

  }

  resetYDomain () {
    this.canvasNode.resetYDomain()

  }

  handleSelection (interactives, moreProps, e) {

    const fibs = _.find(interactives, {type: 'FibonacciRetracement'})
    const openOrderMarkers = _.find(interactives, {type: 'OpenOrderMarker'})
    const orderHistoryMarkers = _.find(interactives, {type: 'OrderHistory'})

    const openOrders = this.props.openOrders
    // console.log('openOrders', openOrders)

    if (this.state.enableInteractiveObject) {
      console.log('enableInteractiveObject')
      const independentCharts = moreProps.currentCharts.filter(d => d !== 2)
      if (independentCharts.length > 0) {
        const first = head(independentCharts)

        const morePropsForChart = getMorePropsForChart(moreProps, first)
        const {
          mouseXY: [, mouseY],
          chartConfig: {yScale},
          xAccessor,
          currentItem
        } = morePropsForChart

        const position = [xAccessor(currentItem), yScale.invert(mouseY)]

        const newText = {
          ...InteractiveText.defaultProps.defaultText,
          position
        }
        this.handleChoosePosition(newText, morePropsForChart, e)
      }
    } else {
      const state = toObject(interactives, each => {
        return [
          `interactiveText_${each.chartId}`,
          each.objects
        ]
      })
      this.setState(state)
    }

  }

  handleChoosePosition (text, moreProps) {

    const {id: chartId} = moreProps.chartConfig

    const state = {
      [`interactiveText_${chartId}`]: [
        ...this.state[`interactiveText_${chartId}`],
        text
      ],
      // enableInteractiveObject: false,
      showModal: false,
      text: text.text,
      chartId
    }

    this.setState(state)
  }

  onDrawComplete (textList, moreProps) {

    // log.red('onDrawComplete', JSON.stringify(textList, null, 2))
    // this gets called on
    // 1. draw complete of drawing object
    // 2. drag complete of drawing object
    const {id: chartId} = moreProps.chartConfig

    this.setState({
      enableInteractiveObject: false,
      [`interactiveText_${chartId}`]: textList
    })
  }

  handleTextChange (text, chartId) {
    const textList = this.state[`interactiveText_${chartId}`]
    const allButLast = textList
      .slice(0, textList.length - 1)

    const lastText = {
      ...last(textList),
      text
    }

    this.setState({
      [`interactiveText_${chartId}`]: [
        ...allButLast,
        lastText
      ],
      showModal: false,
      enableInteractiveObject: false
    })
    this.componentDidMount()
  }

  onKeyPress (e) {

    const actions = this.props.chartDataActions
    const toggleFibOrder = this.props.toggleFibOrderd

    const keyCode = e.which
    // console.log('keyCode', keyCode)
    switch (keyCode) {
      case 68: {
        this.placeNewOrder()
      }
      case 82: {
        this.resetYDomain()
      }
      case 8: // DEL Macbook Pro
      case 46: { // DEL PC
        const retracements_1 = []
        const retracements_3 = []
        this.setState({
          retracements_1,
          retracements_3
        })
        actions.setRetracements_1([])
        actions.setRetracements_3([])
        actions.enableFib(false)
        actions.toggleFibOrder(false)
        break
      }
      case 27: { // ESC
        const retracements_1 = []
        const retracements_3 = []
        this.setState({
          retracements_1,
          retracements_3
        })
        actions.setRetracements_1([])
        actions.setRetracements_3([])
        actions.enableFib(false)
        actions.toggleFibOrder(false)
        break
      }
      case 69: { // E - Enable TrendLine
        this.setState({
          enableTrendLinde: true
        })
        break
      }
      case 70: { // F - Enable Fib
        this.setState({
          enableFib: true
        })

        if (!toggleFibOrder) {
          actions.toggleFibOrder(true)
          actions.enableFib(true)
        }
        break
      }
      case 66: { // B - Buy Order Single
        this.setState({
          enableInteractiveObject: true
        })
        break
      }
    }
  }

  placeNewOrder (e) {
    console.log('e', e)

  }

  handleDoubleClick (e) {
    console.log('handleDoubleClick e', e)

  }

  onOpenOrderDragComplete (__open_orders) {

    const actions = this.props.chartDataActions

    actions.placeOpenOrders(false)

    let open_orders = _.map(__open_orders, function (__obj) {
      if (__obj.selected) {
        // console.log('__obj.selected', __obj)
        __obj.appearance.stroke = '#FF8200'
        __obj.Limit = __obj.end[1]
      }
      return __obj
    })

    // this.setState({
    //   enableTrendLine: false,
    //   trends_1: __open_orders
    // })

    const open_buy_orders = _.filter(open_orders, function (__obj) {
      return __obj.side === 'buy'
    })

    const open_sell_orders = _.filter(open_orders, function (__obj) {
      return __obj.side === 'sell'
    })

    if (open_buy_orders.length > 0) {
      actions.setOpenBuyOrders(open_buy_orders)
    }

    if (open_sell_orders.length > 0) {
      actions.setOpenSellOrders(open_sell_orders)
    }

  }

  onOpenOrderSelect (e) {
    console.log('e.target', e.target)
  }

  render () {

    const __self = this
    const actions = this.props.chartDataActions
    const open_buy_orders = this.props.open_buy_orders
    const open_sell_orders = this.props.open_sell_orders
    const {type, data: initialData, width, ratio, interval} = this.props
    const openOrders = this.props.openOrders
    const textList_1 = this.props.textList_1
    const orderHistoryList_1 = this.props.orderHistoryList_1
    const margin = {left: 72, right: 72, top: 40, bottom: 40}
    const height = this.state.chartHeight
    const height_chart_volume = 180
    const risk = this.props.risk
    const min_profit = this.props.min_profit
    const buy_price = this.props.buy_price

    const ema26 = ema().id(0).options({windowSize: 26}).merge((d, c) => { d.ema26 = c }).accessor(d => d.ema26)

    const ema12 = ema().id(1).options({windowSize: 12}).merge((d, c) => {d.ema12 = c}).accessor(d => d.ema12)

    const macdCalculator = macd().options({
      fast: 12,
      slow: 26,
      signal: 9
    }).merge((d, c) => {d.macd = c}).accessor(d => d.macd)

    const ma_length = this.props.ma_length

    const __volume = sma().id(3).options({
      windowSize: ma_length,
      sourcePath: 'volume'
    }).merge((d, c) => {d.smaVolume50 = c}).accessor(d => d.smaVolume50)

    const calculatedData = macdCalculator(__volume(ema12(ema26(initialData))))
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor
    } = xScaleProvider(calculatedData)

    const __last = this.props.last
    const start = xAccessor(_.last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]
    const base = this.props.base
    const comp = this.props.comp

    const defaultAnnotationProps = {
      onClick: console.log.bind(console)
    }
    const orderHistoryArrowOpacity = 0.74

    const __styles = {
      $color1: '#757575',
      $color2: '#6E8AF5',
      $color3: '#C0C5E2',
      $color4: '#7e8197',
      $color5: '#545d8d',
      $color6: '#a4444a',
      $color7: '#d38092',
      $color8: '#589666',
      $color9: '#86de9a',
      $white: '#FFFFFF'

    }

    const enabled_interactives = !(
      this.state.enableOrderMarker
      && this.state.enableOrderHistoryMarker
      && this.props.enableFib
      && this.state.enableInteractiveObject
      && this.state.enableTrendLine
      && this.state.enableTrendLine
    )

    const obj_map_interactives = {
      OpenOrderMarker: 'textList',
      OrderHistory: 'orderHistoryList',
      FibonacciRetracement: 'retracements',
      InteractiveText: 'interactiveText',
      Trendline: 'textList'
    }
    const candles = {
      candleStrokeWidth: 0.25,
      opacity: 0.85,
      stroke: 'none',
      wickStroke: d => d.close > d.open ? "#31553a" : "#81565d",
    }

    let drag_BUY = this.props.drag_BUY
    let drag_SELL = this.props.drag_SELL

    let buy_line_opacity = 0

    if (!drag_BUY) {
      buy_line_opacity = 0.50
    } else {
      buy_line_opacity = 0
    }

    let sell_line_opacity = 0

    if (!drag_SELL) {
      sell_line_opacity = 0.50
    } else {
      sell_line_opacity = 0
    }

    const drag_open_sell_order = function () {
      if (drag_SELL) {
        return (
          <Drag__SellOrder ref={__self.saveInteractiveNodes('Trendline', 1)}
                           trends={open_sell_orders}
                           side={'sell'}
                           enabled={__self.state.enableTrendLine}
                           type="RAY"
                           snap={false}
                           snapTo={d => [d.high, d.low]}
                           onComplete={__self.onOpenOrderDragComplete}/>

        )
      }
    }

    const drag_open_buy_order = function () {
      if (drag_BUY) {
        return (
          <Drag__BuyOrder ref={__self.saveInteractiveNodes('Trendline', 1)}
                          trends={open_buy_orders}
                          open_buy_orders={open_buy_orders}
                          side={'buy'}
                          enabled={__self.state.enableTrendLine}
                          type="RAY"
                          snap={false}
                          snapTo={d => [d.high, d.low]}
                          onComplete={__self.onOpenOrderDragComplete}/>
        )
      }
    }

    const percentage = 0.3125

    let start_price = 0.002101
    let start_price_2 = 0.00210

    let conversion_percentage = percentage / 100

    let profit_desired = start_price * conversion_percentage
    let next_price = start_price + profit_desired

    const start_num__ = 0.00002625
    const numbers__ = [
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
      0.00002625,
    ]

    const lines_1 =  []
    const lines_2 =  []

    for (let i = 0; i < numbers__.length; i++) {

      let num = start_price * (percentage / 100)
      let val = start_price + num
      start_price = val

      let num_2 = start_price_2 * (percentage / 100)
      let val_2 = start_price_2 + num_2
      start_price_2 = val_2

      lines_1.push(utils.__toFixed(val))
      lines_2.push(utils.__toFixed(val_2))

    }

    const channels_1 = lines_1.map(function (__number, __idx) {
      let guid = chance.guid()
      return (
        <PriceCoordinate id={'current_base'}
                         key={guid}
                         displayFormat={format(utils.currencyFormat(base))}
                         at={'left'}
                         orient={'left'}
                         rectHeight={12}
                         dx={0}
                         x1_Offset={0}
                         x2_Offset={0}
                         lineStroke={'#00A2FF'}
                         fill={'#00A2FF'}
                         opacity={0.90}
                         lineOpacity={0.20}
                         lineStrokeDasharray={'LongDash'}
                         fontSize={9}
                         text={''}
                         price={__number}/>
      )

    })

    const channels_2 = lines_2.map(function (__number, __idx) {
      let guid = chance.guid()
      return (
        <PriceCoordinate id={'current_base'}
                         key={guid}
                         displayFormat={format(utils.currencyFormat(base))}
                         at={'left'}
                         orient={'left'}
                         rectHeight={12}
                         dx={0}
                         x1_Offset={0}
                         x2_Offset={0}
                         lineStroke={'#FF8200'}
                         fill={'#FF8200'}
                         opacity={0.90}
                         lineOpacity={0.20}
                         lineStrokeDasharray={'LongDash'}
                         fontSize={9}
                         text={''}
                         price={__number}/>
      )

    })

    const orderHistory = this.props.orderHistory

    return (

      <ChartCanvas ref={this.saveCanvasNode}
                   height={this.state.chartHeight}
                   width={width}
                   ratio={ratio}
                   margin={margin}
                   type={type}
                   interval={interval}
                   seriesName="series"
                   data={data}
                   xScale={xScale}
                   xAccessor={xAccessor}
                   displayXAccessor={displayXAccessor}>

        <DrawingObjectSelector enabled={enabled_interactives}
                               getInteractiveNodes={this.getInteractiveNodes}
                               drawingObjectMap={obj_map_interactives}
                               onDoubleClick={this.handleDoubleClick}
                               onSelect={this.handleSelection}/>

        <Chart id={1}
               yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
               padding={{top: 10, bottom: 0}}>

          <XAxis axisAt="top"
                 orient="top"
                 ticks={12}
                 xZoomHeight={40}
                 opacity={0.75}
                 stroke={__styles.$color4}
                 tickStroke={__styles.$color4}/>

          <XAxis axisAt="bottom"
                 orient="bottom"
                 ticks={12}
                 xZoomHeight={40}
                 opacity={0.75}
                 stroke={__styles.$color4}
                 tickStroke={__styles.$color4}/>

          <YAxis id={'yAxis_left'}
                 className="y-axis-left"
                 axisAt={'left'}
                 orient={'left'}
                 ticks={12}
                 opacity={0.75}
                 bg={{x: 0, y: -40, w: 72, h: height}}
                 fill="#FFFFFF"
                 stroke={__styles.$color4}
                 tickStroke={__styles.$color4}/>

          <YAxis axisAt="right"
                 orient="right"
                 ticks={12}
                 opacity={0.75}
                 bg={{x: 72, y: -40, w: 72, h: height}}
                 className="y-axis-right"
                 fill="#FFFFFF"
                 stroke={__styles.$color4}
                 tickStroke={__styles.$color4}/>

          {/*{channels_1}*/}
          {/*{channels_2}*/}

          <MouseCoordinateX at="top"
                            orient="top"
                            displayFormat={timeFormat('%b %e, %_I:%M %p')}/>

          <MouseCoordinateX at="bottom"
                            orient="bottom"
                            displayFormat={timeFormat('%b %e, %_I:%M %p')}/>

          <MouseCoordinateY at="right"
                            orient="right"
                            rectHeight={12}
                            displayFormat={format(utils.mouseCoordinateY__format(base))}/>

          <MouseCoordinateY at="left"
                            orient="left"
                            rectHeight={12}
                            displayFormat={format(utils.mouseCoordinateY__format(base))}/>

          <CurrentCoordinate yAccessor={ema26.accessor()}
                             fill={ema26.stroke()}/>

          <CurrentCoordinate yAccessor={ema12.accessor()}
                             fill={ema12.stroke()}/>

          <CandlestickSeries opacity={candles.opacity}
                             strokeOpacity={candles.strokeopacity}
                             candleStrokeWidth={candles.candleStrokeWidth}
                             stroke={candles.stroke}
                             wickStroke={candles.wickStroke}/>

          {/*<LineSeries yAccessor={ema26.accessor()}*/}
                      {/*stroke={ema26.stroke()}/>*/}

          {/*<LineSeries yAccessor={ema12.accessor()}*/}
                      {/*stroke={ema12.stroke()}/>*/}

          <FibOrders ref={this.saveInteractiveNodes('FibonacciRetracement', 1)}
                     side={this.props.side}
                     enabled={this.props.enableFib}
                     retracements={this.props.retracements_1}
                     onComplete={this.onFibComplete1}/>

          <Closed__BuyOrders side={'buy'}
                             orderHistory={orderHistory}
                             base={base}
                             comp={comp}
                             opacity={0.50}/>

          <Closed__SellOrders side={'sell'}
                              orderHistory={orderHistory}
                              base={base}
                              comp={comp}
                              opacity={0.50}/>


          <Ask id={'current_ask_price'}
               displayFormat={format(utils.currencyFormat(base))}
               at={'right'}
               orient={'right'}
               rectHeight={12}
               rectWidth={52}
               dx={40}
               x1_Offset={0}
               x2_Offset={32}
               lineStroke={'#ff3d4c'}
               fill={'#ff3d4c'}
               opacity={1}
               lineOpacity={0.50}
               lineStrokeDasharray={'ShortDashDotDot'}
               fontSize={9}
               text={'ASK'}
               price={__last.ask}/>

          <Bid id={'current_bid_price'}
               displayFormat={format(utils.currencyFormat(base))}
               at={'right'}
               orient={'right'}
               rectHeight={12}
               rectWidth={52}
               dx={0}
               x1_Offset={0}
               x2_Offset={0}
               lineStroke={'#34a633'}
               fill={'#34a633'}
               opacity={1}
               lineOpacity={0.50}
               lineStrokeDasharray={'ShortDashDotDot'}
               fontSize={9}
               text={'BID'}
               price={__last.bid}/>

          <Last id={'current_bid_price'}
                displayFormat={format(utils.currencyFormat(base))}
                at={'left'}
                orient={'left'}
                rectHeight={12}
                dx={0}
                x1_Offset={0}
                x2_Offset={0}
                lineStroke={'#e1d915'}
                fill={'#e1d915'}
                textFill={'#292929'}
                opacity={1}
                lineOpacity={0.50}
                strokeWidth={5}
                lineStrokeDasharray={'ShortDashDotDot'}
                fontSize={9}
                text={_.toString(utils.__toFixed(__last.last, null, 2, 6))}
                //text={'LAST'}
                price={utils.__toFixed(__last.last, null, 2, 6)}/>


          {drag_open_sell_order()}
          {drag_open_buy_order()}

          <Open__SellOrder__Marker openOrders={open_sell_orders}
                                   side={'sell'}
                                   lineOpacity={sell_line_opacity}
                                   fontSize={11}
                                   rectHeight={12}
                                   base={base}
                                   comp={comp}/>

          <Open__BuyOrder__Marker openOrders={open_buy_orders}
                                  side={'buy'}
                                  lineOpacity={buy_line_opacity}
                                  fontSize={11}
                                  rectHeight={12}
                                  base={base}
                                  comp={comp}/>

        </Chart>

        <Chart id={2} height={height_chart_volume}
               yExtents={[d => d.volume, __volume.accessor()]}
               origin={(w, h) => [0, h - height_chart_volume]}>

          <BarSeries yAccessor={d => d.volume}
                     fill={d => d.close > d.open ? "#589666" : "#a4444a"}
                     stroke={false}
                     opacity={0.70} />

          <AreaSeries yAccessor={__volume.accessor()}
                      stroke={'#6E8AF5'}
                      fill={'#405E99'}
                      opacity={0.40}/>

        </Chart>

        <CrossHairCursor opacity={0.40}
                         strokeDasharray={'ShortDot'}/>

      </ChartCanvas>

    )
  }

}

ChartFib.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
}

ChartFib.defaultProps = {
  type: 'svg'
}

ChartFib = fitWidth(ChartFib)

function mapStateToProps (state) {
  return {


    ma_length: state.chartData.ma_length,
    last: state.chartData.last,
    data: state.chartData.candleData,
    balances: state.chartData.balances,
    height: 1200,
    openOrders: state.chartData.openOrders,

    open_buy_orders: state.chartData.open_buy_orders,
    open_sell_orders: state.chartData.open_sell_orders,

    min_profit: state.chartData.min_profit,
    buy_price: state.chartData.buy_price,

    textList_1: state.chartData.textList_1,
    orderHistory: state.chartData.orderHistory,
    orderHistoryList_1: state.chartData.orderHistoryList_1,
    allOrders: state.chartData.allOrders,
    orderViewToggle: state.chartData.orderViewToggle,
    ordersCancelled: state.chartData.ordersCancelled,
    margins: {left: 12, right: 56, top: 0, bottom: 0},
    interval: state.chartData.interval,
    market: state.chartData.market,
    symbol: state.chartData.symbol,
    side: state.chartData.side,
    risk: state.chartData.risk,
    base: state.chartData.base,
    comp: state.chartData.comp,
    orderType: state.chartData.orderType,
    paradigm: state.chartData.paradigm,
    paradigmArray: state.chartData.paradigmArray,
    amountsArray: state.chartData.amountsArray,
    riskAmount: state.chartData.riskAmount,
    baseAmount: state.chartData.baseAmount,
    riskDivision: state.chartData.riskDivision,
    close: state.chartData.close,
    enableFib: state.chartData.enableFib,
    toggleFibOrder: state.chartData.toggleFibOrder,
    retracements_1: state.chartData.retracements_1,
    retracements_3: state.chartData.retracements_3,
    resistance_high: state.chartData.resistance_high,
    resistance_mid: state.chartData.resistance_mid,
    resistance_low: state.chartData.resistance_low,
    inputStep: state.chartData.inputStep,
    drag_BUY: state.chartData.drag_BUY,
    drag_SELL: state.chartData.drag_SELL
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
)(ChartFib)

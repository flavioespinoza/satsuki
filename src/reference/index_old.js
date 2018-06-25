/**
 * Created by Flavor on 1/1/18.
 */

import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart_x';

import _ from 'lodash'
import TypeChooser  from "./TypeChooser";
import ChartInterval from './chart-interval'
import Markets from './markets'
import Controls from './controls'

import registerServiceWorker from '../registerServiceWorker';

import socketIOClient from 'socket.io-client'
import __endpoint from '../endpoints/endpoint'
import $ from 'jquery'

socket.on('markets', function (__markets) {
  render(<Markets market={__markets.market_name} allMarkets={__markets.all_markets} />, document.getElementById('markets'))
  render(<div>{__markets.market_name}</div>, document.getElementById('marketTitle'))
})

class ChartComponent extends React.Component {
  constructor (props) {
    super(props);

  }
  componentDidMount() {

  }
  render() {
    const { data, balances, height, margins, interval, market } = this.props
    return (
      <TypeChooser>
        {type => <Chart
          type={type}
          height={height}
          margins={margins}
          data={data}
          balances={balances}
          interval={interval}
          market={market}
        />}
      </TypeChooser>
    )
  }
}

socket.on('candle_data', function (__candle_data) {

  render(<Controls balances={__candle_data.balances} />, document.getElementById('controls'))


  const __data = []

  _.each(__candle_data.data, function (obj) {

    let __date_obj = new Date(obj.date)

    __data.push({
      date:__date_obj,
      stamp: obj.stamp,
      open: obj.open,
      close: obj.close,
      high: obj.high,
      low: obj.low,
      volume: obj.volume
    })

  })



  render(<ChartComponent
    height={720}
    margins={{ left: 12, right: 56, top: 0, bottom: 0 }}
    data={__data}
    balances={__candle_data.balances}
    interval={__candle_data.interval}
    market={__candle_data.market} />, document.getElementById("chart"))

})


registerServiceWorker();
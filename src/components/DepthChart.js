
// @gbalabasquer I figured it out, you should pass any curve function from d3-shape into the interpolation prop. Since v0.7.0-beta.24 it is possible to do this in AreaSeries.
//
//   import { curveStepBefore } from 'd3-shape';
//
// <AreaSeries
//   interpolation={curveStepBefore}
// />

function depthChart () {

  let data = []
  let data_bids = []

  let __cum_data = []
  let __cum_data_bids = []

  let svg
  let defs
  let g_brush
  let brush

  /** MAIN */
  let main_xScale
  let main_yScale
  let main_margin
  let main_height
  let main_width

  let main_yZoom
  let main_xAxis
  let main_yAxis

  /** MINI */
  let mini_xScale
  let mini_yScale
  let mini_margin
  let mini_height
  let mini_width

  let text_scale

  const __order_book = order_book

  const asks_color = '#FF69B4'
  const bids_color = '#6495ED'

  let prefixSum = function (arr) {
    let builder = function (acc, n) {
      let lastNum = acc.length > 0 ? acc[acc.length - 1] : 0
      acc.push(lastNum + n)
      return acc
    }
    return _.reduce(arr, builder, [])
  }

  init()

  function init () {

    // create cumulative data array
    for (let i = 0; i < __order_book.bids.length; i++) {
      __cum_data_bids.push(__order_book.bids[i].amount)
    }
    let cum_data_array_bids = prefixSum(__cum_data_bids)

    for (let i = 0; i < __order_book.bids.length; i++) {

      let __idx = __order_book.bids[i].price.toFixed(2)

      data_bids.push({
        key: i + __order_book.bids.length,
        idx: +__idx,
        y_axis_position: __idx,
        orders: cum_data_array_bids[i],
        value: cum_data_array_bids[i],
        side: __order_book.bids[i].side,
      })
    }

    // create cumulative data array
    for (let i = 0; i < __order_book.asks.length; i++) {
      __cum_data.push(__order_book.asks[i].amount)
    }
    let cum_data_array = prefixSum(__cum_data)

    // final data array
    for (let i = 0; i < __order_book.asks.length; i++) {

      let __idx = __order_book.asks[i].price.toFixed(2)

      data.push({
        key: i,
        idx: +__idx,
        y_axis_position: __idx,
        orders: cum_data_array[i],
        value: cum_data_array[i],
        side: __order_book.asks[i].side,
      })
    }

    // reverse data for bids
    // data = _.reverse(data)
    data.forEach(function (d) {
      d.orders = +d.orders
    })
    data_bids.forEach(function (d) {
      d.orders = +d.orders
    })

    _.reverse(data_bids)

    // console.log('asks', data)
    // console.log('bids', data_bids)

    data = data_bids.concat(data)

    _.reverse(data)

    console.log('data', data)

    //Added only for the mouse wheel
    let zoomer = d3.behavior.zoom()
      .on('zoom', null)

    main_margin = {top: 10, right: 10, bottom: 30, left: 100}
    main_height = 1000 - main_margin.top - main_margin.bottom
    main_width = 320 - main_margin.left - main_margin.right

    mini_margin = {top: 10, right: 10, bottom: 30, left: 10}
    mini_height = 1000 - mini_margin.top - mini_margin.bottom
    mini_width = 72 - mini_margin.left - mini_margin.right

    svg = d3.select('#dChart').append('svg')
      .attr('class', 'svgWrapper')
      .attr('width', main_width + main_margin.left + main_margin.right + mini_width + mini_margin.left + mini_margin.right)
      .attr('height', main_height + main_margin.top + main_margin.bottom)
      .call(zoomer)
      .on('wheel.zoom', scroll)
      .on("mousewheel.zoom", scroll)
      .on("DOMMouseScroll.zoom", scroll)
      .on("MozMousePixelScroll.zoom", scroll)
      //Is this needed?
      .on('mousedown.zoom', null)
    // .on('touchstart.zoom', null)
    // .on('touchmove.zoom', null)
    // .on('touchend.zoom', null)

    let mainGroup = svg.append('g')
      .attr('class', 'mainGroupWrapper')
      .attr('transform', 'translate(' + main_margin.left + ',' + main_margin.top + ')')
      .append('g') //another one for the clip path - due to not wanting to clip the labels
      .attr('clip-path', 'url(#clip)')
      .style('clip-path', 'url(#clip)')
      .attr('class', 'mainGroup')

    let miniGroup = svg.append('g')
      .attr('class', 'miniGroup')
      .attr('transform', 'translate(' + (main_margin.left + main_width + main_margin.right + mini_margin.left) + ',' + mini_margin.top + ')')

    let brushGroup = svg.append('g')
      .attr('class', 'brushGroup')
      .attr('transform', 'translate(' + (main_margin.left + main_width + main_margin.right + mini_margin.left) + ',' + mini_margin.top + ')')

    main_xScale = d3.scale.linear().range([0, main_width])
    mini_xScale = d3.scale.linear().range([0, mini_width])

    // main_yScale = d3.scale.ordinal().rangeBands([0, main_height], 0.1, 0)
    // mini_yScale = d3.scale.ordinal().rangeBands([0, mini_height], 0.1, 0)

    main_yScale = d3.scale.ordinal().rangeBands([0, main_height], 0, 0)
    mini_yScale = d3.scale.ordinal().rangeBands([0, mini_height], 0, 0)

    //Based on the idea from: http://stackoverflow.com/questions/21485339/d3-brushing-on-grouped-bar-chart
    main_yZoom = d3.scale.linear()
      .range([0, main_height])
      .domain([0, main_height])

    //Create x axis object
    main_xAxis = d3.svg.axis()
      .scale(main_xScale)
      .orient('bottom')
      .ticks(4)
      //.tickSize(0)
      .outerTickSize(0)

    //Add group for the x axis
    d3.select('.mainGroupWrapper').append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + 0 + ',' + (main_height) + ')')

    //Create y axis object
    main_yAxis = d3.svg.axis()
      .scale(main_yScale)
      .orient('left')
      .tickSize(0)
      .outerTickSize(0)

    //Add group for the y axis
    mainGroup.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-5,0)')

    //Update the scales
    main_xScale.domain([0, d3.max(data, function (d) { return d.value })])
    mini_xScale.domain([0, d3.max(data, function (d) { return d.value })])
    main_yScale.domain(data.map(function (d) { return d.y_axis_position }))
    mini_yScale.domain(data.map(function (d) { return d.y_axis_position }))

    //Create the visual part of the y axis
    d3.select('.mainGroup').select('.y.axis').call(main_yAxis)
    d3.select('.mainGroupWrapper').select('.x.axis').call(main_xAxis)

    text_scale = d3.scale.linear()
      .domain([15, 50])
      .range([12, 6])
      .clamp(true)

    //What should the first extent of the brush become - a bit arbitrary this
    let brushExtent = Math.max(1, Math.min(20, Math.round(data.length * 0.2)))

    brush = d3.svg.brush()
      .y(mini_yScale)
      .extent([mini_yScale(data[0].y_axis_position), mini_yScale(data[brushExtent].y_axis_position)])
      .on('brush', brushmove)
    //.on("brushend", brushend);

    //Set up the visual part of the brush
    g_brush = d3.select('.brushGroup').append('g')
      .attr('class', 'brush')
      .call(brush)

    g_brush.selectAll('.resize')
      .append('line')
      .attr('x2', mini_width)

    g_brush.selectAll('.resize')
      .append('path')
      .attr('d', d3.svg.symbol().type('triangle-up').size(20))
      .attr('transform', function (d, i) {
        return i ? 'translate(' + (mini_width / 2) + ',' + 4 + ') rotate(180)' : 'translate(' + (mini_width / 2) + ',' + -4 + ') rotate(0)'
      })

    g_brush.selectAll('rect')
      .attr('width', mini_width)

    //On a click recenter the brush window
    g_brush.select('.background')
      .on('mousedown.brush', brushcenter)
      .on('touchstart.brush', brushcenter)

    defs = svg.append('defs')

    //Add the clip path for the main bar chart
    defs.append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', -main_margin.left)
      .attr('width', main_width + main_margin.left)
      .attr('height', main_height)

    //The mini brushable bar
    //DATA JOIN
    let mini_bar = d3.select('.miniGroup').selectAll('.bar')
      .data(data, function (d) { return d.key })

    //UDPATE
    mini_bar
      .attr('width', function (d) { return mini_xScale(d.value) })
      .attr('y', function (d, i) { return mini_yScale(d.y_axis_position) })
      .attr('height', mini_yScale.rangeBand() + 20)

    //ENTER
    mini_bar.enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('width', function (d) { return mini_xScale(d.value) })
      .attr('y', function (d, i) { return mini_yScale(d.y_axis_position) })
      .attr('height', mini_yScale.rangeBand() + 20)
      .style('fill', function (d) {
        if (d.side === 'buy') {
          return bids_color
        } else {
          return asks_color
        }
      })

    //EXIT
    mini_bar.exit()
      .remove()

    //Start the brush
    g_brush.call(brush.event)

  }

//Function runs on a brush move - to update the big bar chart
  function update () {

    /////////////////////////////////////////////////////////////
    ////////// Update the bars of the main bar chart ////////////
    /////////////////////////////////////////////////////////////

    //DATA JOIN
    let bar = d3.select('.mainGroup').selectAll('.bar')
      .data(data, function (d) { return d.key })

    //UPDATE
    bar
      .attr('x', 0)
      .attr('width', function (d) { return main_xScale(d.value) })
      .attr('y', function (d, i) { return main_yScale(d.y_axis_position) })
      .attr('height', main_yScale.rangeBand() + 20)

    //ENTER
    bar.enter().append('rect')
      .attr('class', 'bar')
      .style('fill', function (d) {
        if (d.side === 'buy') {
          return bids_color
        } else {
          return asks_color
        }
      })
      .attr('x', 0)
      .attr('width', function (d) { return main_xScale(d.value) })
      .attr('y', function (d, i) { return main_yScale(d.y_axis_position) })
      .attr('height', main_yScale.rangeBand() + 20)

    //EXIT
    bar.exit()
      .remove()

  }

//First function that runs on a brush move
  function brushmove () {

    let extent = brush.extent()

    //Reset the part that is visible on the big chart
    let originalRange = main_yZoom.range()
    main_yZoom.domain(extent)

    //Update the domain of the x & y scale of the big bar chart
    main_yScale.domain(data.map(function (d) { return d.y_axis_position }))
    main_yScale.rangeBands([main_yZoom(originalRange[0]), main_yZoom(originalRange[1])], 0.4, 0)

    //Update the y axis of the big chart
    d3.select('.mainGroup')
      .select('.y.axis')
      .call(main_yAxis)

    //Update the colors within the mini bar chart
    let selected = mini_yScale.domain()
      .filter(function (d) { return (extent[0] - mini_yScale.rangeBand() + 1e-2 <= mini_yScale(d)) && (mini_yScale(d) <= extent[1] - 1e-2) })
    //Update the colors of the mini chart - Make everything outside the brush grey
    d3.select('.miniGroup').selectAll('.bar')
      .style('fill', function (d, i) {
        if (d.side === 'buy') {
          return bids_color
        } else {
          return asks_color
        }
      })

    //Update the label size
    d3.selectAll('.y.axis text')
      .style('font-size', text_scale(selected.length))

    //Update the big bar chart
    update()

  }

  function brushcenter () {
    let target = d3.event.target,
      extent = brush.extent(),
      size = extent[1] - extent[0],
      range = mini_yScale.range(),
      y0 = d3.min(range) + size / 2,
      y1 = d3.max(range) + mini_yScale.rangeBand() - size / 2,
      center = Math.max(y0, Math.min(y1, d3.mouse(target)[1]))

    d3.event.stopPropagation()

    g_brush
      .call(brush.extent([center - size / 2, center + size / 2]))
      .call(brush.event)

  }

  function scroll () {

    //Mouse scroll on the mini chart
    let extent = brush.extent(),
      size = extent[1] - extent[0],
      range = mini_yScale.range(),
      y0 = d3.min(range),
      y1 = d3.max(range) + mini_yScale.rangeBand(),
      dy = d3.event.deltaY,
      topSection

    if (extent[0] - dy < y0) { topSection = y0 }
    else if (extent[1] - dy > y1) { topSection = y1 - size }
    else { topSection = extent[0] - dy }

    //Make sure the page doesn't scroll as well
    d3.event.stopPropagation()
    d3.event.preventDefault()

    g_brush
      .call(brush.extent([topSection, topSection + size]))
      .call(brush.event)

  }

}
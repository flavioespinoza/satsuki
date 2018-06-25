import React, { Component } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ReactTooltip from 'react-tooltip'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'

import io from 'socket.io-client'
import _ from 'lodash'
import endpoint from '../endpoints/endpoint'

const log = require('ololog').configure({
  locate: false
})

function capitalizeFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

class OrderListHeader extends Component {

  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this. changeSide = this.changeSide.bind(this)
    this.handleRisk = this.handleRisk.bind(this)
    this.showParadigmGraph = this.showParadigmGraph.bind(this)

    this.state = {
      value: 0
    }
  }

  componentDidMount () {

    const actions = this.props.chartDataActions

    const risk = this.props.risk

    log.yellow('____risk OrderListHeader before socket', risk)


    const paradigm = this.props.paradigm
    const worksheet = this.props.worksheet

    let lotSum = 0

    let selectedWorksheet = {
      spreadsheet_id: '1P_Xf80NSkKaKoa-9t16tI4uQgSUOjgMf-wb6aDdcSB4',
      worksheet_id: 'o9d3rw9',
      title: '__p_single_order'
    }

    socket.emit('get_worksheet', selectedWorksheet)
    socket.on('selected_worksheet', function (__selected_worksheet) {

      log.magenta('____risk OrderListHeader after socket', risk)

      const paradigmArray = []
      const amountArray = []
      const lotSumArray = []

      for (let i = 0; i < __selected_worksheet.grid.length; i++) {

        if (i !== 0) {
          __selected_worksheet.grid[i][4].value = risk
          __selected_worksheet.grid[i][5].value = _.round(risk * __selected_worksheet.grid[i][3].value, 2)
          paradigmArray.push(__selected_worksheet.grid[i][0].value)
          lotSumArray.push(__selected_worksheet.grid[i][5].value)
        }

      }

      lotSum = _.sum(lotSumArray)

      actions.setWorksheet(__selected_worksheet)
      actions.setParadigmArray(paradigmArray.reverse())
      actions.setLotSumArray(lotSumArray)
      actions.setLotSum(lotSum)

    })

  }

  handleChange (__e, __idx, value) {

    const actions = this.props.chartDataActions
    const spreadsheet = this.props.spreadsheet

    let __selected_worksheet = _.find(spreadsheet, function (__obj, __i) {
      return __i === __idx
    })

    actions.setParadigmArray([])
    actions.setParadigm(__selected_worksheet.title)
    this.setState({value})

    socket.emit('get_worksheet', __selected_worksheet)

  }

  changeSide () {
    const actions = this.props.chartDataActions
    let side = this.props.side
    if (side === 'sell') {
      side = 'buy'
      actions.setSide(side)
    } else if (side === 'buy') {
      side = 'sell'
      actions.setSide(side)
    }
  }

  handleRisk (e) {

    const risk = +e.target.value
    const paradigm = this.props.paradigm
    const paradigmArray = []
    const worksheet = this.props.worksheet
    const actions = this.props.chartDataActions
    const lotSumArray = []
    let lotSum = 0

    actions.setRisk(risk)

    console.log('worksheet.title', worksheet.title)

    for (let i = 0; i < worksheet.grid.length; i++) {

      if (i !== 0) {
        worksheet.grid[i][4].value = risk
        worksheet.grid[i][5].value = _.round(risk * worksheet.grid[i][3].value, 2)
        paradigmArray.push(worksheet.grid[i][0].value)
        lotSumArray.push(worksheet.grid[i][5].value)
      }

    }

    lotSum = _.sum(lotSumArray)

    actions.setWorksheet(worksheet)
    actions.setParadigmArray(paradigmArray)
    actions.setLotSumArray(lotSumArray)
    actions.setLotSum(lotSum)

  }

  showParadigmGraph () {

    // window.open("https://docs.google.com/spreadsheets/d/e/2PACX-1vToSaDSq0C_fqFeFb4V1tGHQhobBPUHJcPOrB1vGhnA-1KwwGakfS9Mgn3tduFLxmLetWgHDKlv34-L/pubhtml#");

  }

  render () {

    const styles = {
      sideToggle: {
        width: 108,
        height: 30,
        paddingTop: 8,
        marginTop: 6,
        cursor: 'pointer',
        fontSize: 21,
        letterSpacing: 4,
        textAlign: 'center',
        // background: 'blue',
        borderRight: '1px dotted white'
      },
      risk: {
        position: 'absolute',
        top: 12,
        left: 132,
        width: 56,
        height: 24,
        paddingLeft: 6,
        border: 'none'
      },
      dropDownMenu: {
        position: 'absolute',
        top: 12,
        right: 56,
        height: 24,
        width: 144,
        paddingLeft: 0,
      },
      labelStyle: {
        paddingTop: 0,
        paddingLeft: 6,
        paddingRight: 6,
        height: 26,
        lineHeight: 2.6,
        fontSize: 11,
        background: 'white',
        boxShadow: 'none',
        border: 'none',
      },
      iconStyle: {
        top: -6,
        right: 0,
        padding: 0,
        height: 40,
        width: 40,
        fill: 'black'
      },
      underlineStyle: {
        display: 'none'
      },
      menuStyle: {
        padding: 0
      },
      menuItemStyle: {
        width: 144,
        paddingTop: 6,
        paddingLeft: 0,
        paddingBottom: 6,
        marginLeft: 0,
        fontSize: 11,
        overflow: 'hidden'
      },
      header: {
        background: 'hotpink',
        height: 48
      },
      graphImgBtn: {
        position: 'absolute',
        top: 10,
        right: 12,
        color: 'white',
      }

    }

    const spreadsheet = this.props.spreadsheet
    const menuItems = spreadsheet.map(function (__item, __idx) {
      return (
        <MenuItem key={__idx} value={__idx} primaryText={__item.title} className={'__p_menu_item'}/>
      )
    })

    const paradigm = this.props.paradigm
    const side = this.props.side
    const risk = this.props.risk
    const toggleFibOrder = this.props.toggleFibOrder

    if (side === 'sell') {
      styles.header.background = 'hotpink'
    } else if (side === 'buy') {
      styles.header.background = 'cornflowerblue'
    }

    const idx = _.findIndex(spreadsheet, function (__obj) {
      return __obj.title === paradigm
    })

    return (
      <MuiThemeProvider>

        <div className={'header pos-rel'} style={styles.header}>

          <ReactTooltip/>

          <div className={'headline'}
               style={styles.sideToggle}
               onClick={this.changeSide.bind(this)}>{capitalizeFirst(side)}</div>

          <input style={styles.risk}
                 data-tip="Risk Amount"
                 type="number"
                 defaultValue={risk}
                 onChange={this.handleRisk.bind(this)}/>

          <DropDownMenu
            value={idx}
            onChange={this.handleChange}
            style={styles.dropDownMenu}
            menuStyle={styles.menuStyle}
            menuItemStyle={styles.menuItemStyle}
            labelStyle={styles.labelStyle}
            underlineStyle={styles.underlineStyle}
            iconStyle={styles.iconStyle}
            disabled={toggleFibOrder}
            autoWidth={false}>

            {menuItems}

          </DropDownMenu>

          <button style={styles.graphImgBtn}
                  className="mdl-button mdl-js-button mdl-button--icon"
                  data-tip="Show paradigm graph"
                  onClick={this.showParadigmGraph}>
            <i className="material-icons">photo</i>
          </button>

        </div>

      </MuiThemeProvider>
    )

  }
}

function mapStateToProps (state) {
  return {
    paradigm: state.chartData.paradigm,
    worksheet: state.chartData.worksheet,
    spreadsheet: state.chartData.spreadsheet,
    side: state.chartData.side,
    risk: state.chartData.risk,
    toggleFibOrder: state.chartData.toggleFibOrder,

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
)(OrderListHeader)
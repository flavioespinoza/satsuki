import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import * as utils from '../utils'
import _ from 'lodash'
import { ___get_paradigm_worksheet } from '../index'

const color = utils.color()
const log = require('ololog').configure({
  locate: false
})

class DropDownMenuParadigm extends Component {

  constructor(props) {
    super(props)

    this.getWorksheet = this.getWorksheet.bind(this)
    this.handleParadigmSelection = this.handleParadigmSelection.bind(this)

    this.state = {
      value: 0,
      percentBtnSelected: 0,
    }

  }

  componentDidMount() {
    const getWorksheet = {
      title: '__p_single_order',
      worksheet_id: '__p_single_order',
    }
    this.getWorksheet(getWorksheet)
  }

  getWorksheet (__get_worksheet) {

    ___get_paradigm_worksheet(__get_worksheet)

  }

  handleParadigmSelection(__e, __idx, value) {

    const actions = this.props.chartDataActions
    const spreadsheet = this.props.spreadsheet
    const getWorksheet = _.find(spreadsheet, function(__obj, __i) {
      return __i === __idx
    })
    actions.setParadigmArray([])
    actions.setParadigm(getWorksheet.title)

    this.setState({
      value
    })

    this.getWorksheet(getWorksheet)

  }

  render () {

    const spreadsheet = this.props.spreadsheet
    const paradigm = this.props.paradigm

    const styles = {
      dropDownMenu: {
        position: 'absolute',
        top: 4,
        right: 0,
        height: 24,
        paddingLeft: 0,
      },
      labelStyle: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 4,
        paddingRight: 4,
        height: 16,
        lineHeight: 2,
        fontSize: 8,
        background: 'white',
        color: 'black',
        boxShadow: 'none',
        border: 'none',
        borderRadius: 8,
      },
      iconStyle: {
        display: 'none'
      },
      underlineStyle: {
        display: 'none'
      },
      menuStyle: {
        padding: 0
      },
      menuItemStyle: {
        paddingTop: 6,
        paddingLeft: 0,
        paddingBottom: 6,
        marginLeft: 0,
        fontSize: 11,
        overflow: 'hidden'
      }


    }

    const idx = _.findIndex(spreadsheet, function(__obj) {
      return __obj.title === paradigm
    })

    const menuItems = spreadsheet.map(function (__item, __idx) {
      return (
        <MenuItem key={__idx}
                  value={__idx}
                  primaryText={__item.title}
        />
      )
    })


    return (
      <MuiThemeProvider>

        <DropDownMenu value={idx}
                      onChange={this.handleParadigmSelection}
                      style={styles.dropDownMenu}
                      menuStyle={styles.menuStyle}
                      menuItemStyle={styles.menuItemStyle}
                      labelStyle={styles.labelStyle}
                      underlineStyle={styles.underlineStyle}
                      iconStyle={styles.iconStyle}
                      autoWidth={true}>

          {menuItems}
        </DropDownMenu>

      </MuiThemeProvider>
    )

  }

}

function mapStateToProps(state) {
  return {
    paradigm: state.chartData.paradigm,
    worksheet: state.chartData.worksheet,
    spreadsheet: state.chartData.spreadsheet,
    slave_buy_risk: state.chartData.slave_buy_risk,
    slave_sell_risk: state.chartData.slave_sell_risk,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropDownMenuParadigm)
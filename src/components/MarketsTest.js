
import React from 'react'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Modal from './Modal'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'
import { ___new_market } from '../index'
import _ from 'lodash'

const log = require('ololog').configure({
  locate: false
})

class Markets extends React.Component {

  constructor (props) {
    super(props)
    this.filterList = this.filterList.bind(this)
    this.invalidInput = this.invalidInput.bind(this)

    this.state = {
      allMarkets: [],
      modalOpen: false
    }
  }

  componentWillMount () {
    const {allMarkets} = this.props
    this.setState({
      allMarkets: allMarkets
    })
  }

  componentDidMount () {

  }

  invalidInput () {

    this.props.chartDataActions.handleModal(true, 'Invalid Input', 'Market names contain letters and numbers only.')

  }

  filterList (e) {

    const invalidInput = this.invalidInput
    const allMarkets = this.props.allMarkets

    let val = e.target.value
    let regex = new RegExp(/^[a-z0-9]+$/i)

    if (val === '') {
      this.setState({
        allMarkets: allMarkets
      })
    } else {
      if (!regex.test(val)) {
        invalidInput()
        e.target.value = ''
        return
      }
      let filteredMarketList = allMarkets.filter(function (item) {
        return item.search.toLowerCase().search(val.toLowerCase()) !== -1
      })
      this.setState({
        allMarkets: filteredMarketList
      })
    }
  }

  changeMarket (e, __market_symbol) {

    const all_markets = this.props.allMarkets
    const new_market = _.filter(all_markets, function (__obj) {
      return __obj.symbol === __market_symbol
    })

    ___new_market(new_market[0])

    setTimeout(function () {
      window.location.reload()
    }, 2000)


  }

  render () {

    const {symbol, modalOpen, market, allMarkets} = this.props

    // const marketInfo = _.find(allMarkets, {market: market})

    document.getElementById('marketSymbol').innerHTML = symbol

    // console.log('marketInfo', marketInfo)
    //
    // if (marketInfo.notice) {
    //   document.getElementById('marketNotice').innerHTML = marketInfo.notice
    // }

    if (this.state.allMarkets) {

      let __all_markets = this.state.allMarkets.map((__market, __idx) => {

        function marketStyle () {
          if (__market.notice) {
            return 'radio-notice mb0 pl0'
          } else {
            return 'radio mb0 pl0'
          }
        }

        return (
          <RadioButton className={marketStyle()}
                       key={__idx}
                       value={__market.symbol}
                       label={__market.symbol} />
        )

      })

      const form_style = {
        width: 180,
        height: 25,
        paddingLeft: 12,
        marginLeft: 17,
        marginBottom: 12,
        border: '1px solid #afafaf',
        background: 'gainsboro'
      }

      let market_style = {
        fontSize: 14,
        marginLeft: 9,
        verticalAlign: 'top',
      }

      return (
        <MuiThemeProvider>
          <div>

            <Modal modalOpen={modalOpen}/>

            <div className={'title p12 ml6'}>{symbol}<span className={'text-light'} style={market_style}> current market</span></div>

            <form>
              <fieldset className='form-group'>

                <input style={form_style}
                       onInvalid={this.invalidInput}
                       id='searchMarket'
                       type='text'
                       placeholder={'search'}
                       className='form-control form-control-lg'
                       onChange={this.filterList}/>

              </fieldset>
            </form>

            <RadioButtonGroup name='Markets'
                              className='r-button'
                              defaultSelected={this.props.market}
                              onChange={this.changeMarket.bind(this)}>

              {__all_markets}

            </RadioButtonGroup>

          </div>
        </MuiThemeProvider>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps (state) {
  return {
    allMarkets: state.chartData.allMarkets,
    market: state.chartData.market,
    symbol: state.chartData.symbol,
    modalOpen: state.chartData.modalOpen,
    modalTitle: state.chartData.modalTitle,
    modalMsg: state.chartData.modalMsg,
    minTradeSize: state.chartData.minTradeSize,
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
)(Markets)

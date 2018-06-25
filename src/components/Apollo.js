
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../actions/chartDataActions'

let name = 'Apollo'

class Apollo extends React.Component {
  
  constructor (props) {
    super(props)

    this.query = this.query.bind(this)
    this.resolvers = this.resolvers.bind(this)

    // A list of artists for whom I want to know about upcoming events
    this.state = {}

    this.state.artists = {
      myFavoriteArtists: [
        { name: "Kansas", id: "K8vZ9171C-f" },
        { name: "Lil Yachty", id: "K8vZ9174v57" },
        { name: "Jason Mraz", id: "K8vZ9171CVV" }
      ]
    }

    this.state.url = {
      myFavoriteArtists: function (id, context) {
        return `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${context.secrets.TM_API_KEY}`
      },
      event: function (artist, context) {
        return `https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=${context.secrets.TM_API_KEY}&attractionId=${artist.id}`
      }
    }
    
  }

  query (__artist, __event) {

    // query shit via graph-QL standards

  }

  resolvers () {
    const __self = this
    return {
      Query: {
        myFavoriteArtists: function (root, args, context) {
          return Promise.all(
            _.map(__self.state.artists.myFavoriteArtists, function ({name, id}) {
              return fetch(__self.state.url.myFavoriteArtists(id, context))
                .then(function (res) {
                  return res.json()
                })
                .then(function (data) {
                  return Object.assign({name, id}, data)
                })
            })
          )
        }
      },
      Artist: {
        twitterUrl: function (artist) {
          return artist.externalLinks.twitter[0].url
        },
        image: function (artist) {
          return artist.images[0].url
        },
        events: function (artist, args, context) {
          return fetch(__self.state.url.event(artist, context)).then(function (res) {
            return res.json()
          }).then(function (data) {
            return (data && data._embedded && data._embedded.events) || []
          })
        }
      },
      Event: {
        image: function (event) {
          return event.images[0].url
        },
        startDateTime: function (event) {
          return event.dates.start.dateTime
        }
      }
    }
  }

  render() {

    const __self = this
    const actions = this.props.actions

    const myFavoriteArtists = this.state.artists.myFavoriteArtists

    const artistButtons = _.map(myFavoriteArtists, function (__obj, __idx) {
      return (
        <button id={'query_btn'} key={'query_btn_' + __obj.id} onClick={() => __self.query(__obj)} >
          {__obj.name}
        </button>
      )
    })

    return (
      <div>
        {artistButtons}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    data: state.chartData.candleData,
    balances: state.chartData.balances,
    height: 1200,
    openOrders: state.chartData.openOrders,
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
    inputStep: state.chartData.inputStep
  }
}

function mapDispatchToProps (dispatch) {
  return {
    chartDataActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Apollo);



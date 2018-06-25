
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import _ from 'lodash'

class User extends React.Component {

  render() {

    const user = this.props.user
    const authentication_status = this.props.authentication_status
    const exchange_name = this.props.exchange_name

    let __exchange_name
    if (exchange_name) {
      __exchange_name = exchange_name.toUpperCase()
    }



    const style = {
      div: {
        position: 'relative',
        float: 'left',
        marginLeft: 24,
        marginRight: 24,
        textAlign: 'center',
      },
      auth: {
        marginTop: 6,
        fontSize: 16,
      },
    }

    const authenticated = function () {
      if (authentication_status) {
        return (<i className="material-icons" style={style.auth}>wifi</i>)
      } else {
        return (<i className="material-icons" style={style.auth}>wifi_off</i>)
      }
    }

    return (
      <div>

        <div style={style.div} className={'mt4'}>{__exchange_name}</div>

        <div style={style.div}>{authenticated()}</div>

        <div style={style.div} className={'mt4'}>{user.call_sign}</div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    authentication_status: state.user.authentication_status,
    exchange_name: state.user.exchange_name,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);


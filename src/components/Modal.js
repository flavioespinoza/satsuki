import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as chartDataActions from '../actions/chartDataActions'

class Modal extends React.Component {

  constructor (props) {
    super(props)
    this.state = {}

  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  handleClose = () => {
    this.props.chartDataActions.handleModal(false, null, null)
  }

  render () {

    let modalOpen = this.props.modalOpen
    let modalTitle = this.props.modalTitle
    let modalMsg = this.props.modalMsg

    const actions = [
      <RaisedButton
        label="Got it!"
        primary={true}
        onClick={this.handleClose}
      />
    ]

    return (
      <MuiThemeProvider>
        <div>

          <Dialog
            title={modalTitle}
            actions={actions}
            modal={false}
            open={modalOpen}
            onRequestClose={this.handleClose}>
            {modalMsg}
          </Dialog>

        </div>
      </MuiThemeProvider>

    )
  }

}

function mapStateToProps (state) {
  return {
    modalOpen: state.chartData.modalOpen,
    modalTitle: state.chartData.modalTitle,
    modalMsg: state.chartData.modalMsg,
  }
}

function mapDispatchToProps (dispatch) {
  // this function will now give you access to all your Modal by simply calling this.props.actions.
  return {
    chartDataActions: bindActionCreators(chartDataActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)

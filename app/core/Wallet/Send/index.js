import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'

import PinModal from '../../Shared/PinModal'
import ActionButton from '../../Shared/ActionButton'

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      sendMemoID: '',
      displayErrors: false,
      showPINModal: false,
      currentAddress: props.currentAddress,
      alertOpen: false,
      alertMessage: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePinSubmission = this.handlePinSubmission.bind(this)
    this.togglePINModal = this.togglePINModal.bind(this)
  }

  render() {
    return (
      <div>
        { this.renderSendMoneySection() }
        <PinModal showPINModal={this.state.showPINModal}
                  pinSuccessful={this.handlePinSubmission}
                  toggle={this.togglePINModal} />
        { this.renderAlertView() }
      </div>
    )
  }

  renderSendMoneySection () {
    var formStyle = 'form-control'
    if (this.state.displayErrors) {
      formStyle = `form-control sendAssetFormDisplayErrors`
    }

    const btnTitle = {
      default: 'Send',
      processing: 'Sending'
    }

    return (
      <div id={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>Send to address </label>
            <input type='text' className={formStyle} placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendMemoID'>
              Memo ID (optional)
              <Tooltip id="tooltip-right-start" title="Memo id is required by certain exchanges to transfer funds." placement="right-start">
                 <i className="fa fa-info-circle" style={{marginLeft: '0.25rem'}}> </i>
              </Tooltip>
            </label>
            <input type='text' className={formStyle} placeholder='Memo ID'
              id='sendMemoID' name='sendMemoID' value={this.state.sendMemoID} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM </label>
            <input type='text' className={formStyle} placeholder='Amount in XLM'
              id='sendAmount' name='sendAmount' value={this.state.sendAmount} onChange={this.handleChange} required />
          </div>
          <ActionButton processing={ this.props.paymentSending } title={ btnTitle } isForm={ true } />
        </form>
      </div>
    )
  }

  handleChange (event) {
    const target = event.target
    var value = target.value
    const name = target.name
    if (name==='sendAmount' || name==='sendMemoID') {
      value = value.replace(/[^0.001-9]/g, '')
    }
    this.setState({
      [name]: value
    })
  }

  handleSubmit (event) {
    event.preventDefault()

    //Validation
    if (!event.target.checkValidity()) {
       this.setState({
         displayErrors: true
       })
       return
    }

    if (this.state.sendAddress === this.state.currentAddress) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Send address cannot be your own address.',
        sendAddress: ''
      })
    } else {
      const info = {
        destination: this.state.sendAddress,
        amount: this.state.sendAmount,
        memoId: this.state.sendMemoID
      }
      this.setState({
        info,
        showPINModal: true
      })
    }
  }

  togglePINModal (event) {
    this.setState({
      showPINModal: !this.state.showPINModal
    })
  }

  handlePinSubmission (success) {
    if (success) {
      this.togglePINModal()
      this.props.receiveSendPaymentInfo(this.state.info)
    }
  }

  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={6000}
          onClose={this.handleAlertClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <Button key="close" color="secondary" size="small"
              onClick={this.handleAlertClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    )
  }

  handleAlertOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      alertOpen: false
    })
  }

}

export default Send
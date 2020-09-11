import React from 'react'
import { Props, State } from './UnwrapModal.types'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Field } from 'decentraland-ui/dist/components/Field/Field'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import { locations } from 'routing/locations'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './UnwrapModal.css'

export default class UnwrapModal extends React.PureComponent<Props, State> {

  handleChangeWrapValue = (event: React.FormEvent<HTMLInputElement>) => {
    const raw = event.currentTarget.value || 0
    const value = Number.isNaN(Number(raw)) ? undefined : Number(raw)
    this.setState({ value: value })
  }

  handleWrapMana = () => {
    if (
      this.state.value &&
      this.state.value > 0 &&
      this.props.onUnwrapToken
    ) {
      this.props.onUnwrapToken(this.state.value)
    }
  }

  handleClose = () => {
    if (!this.props.isUnwrappingMana) {
      this.props.onNavigate(locations.wrapping({}))
    }
  }

  isOpen() {
    return this.props.params.modal === 'unwrap'
  }

  render() {
    const { completed } = this.props.params
    return <Modal className="UnwrapModal" open={this.isOpen()} onClose={this.handleClose}>
      <Icon name="close" onClick={this.handleClose} />
      <Modal.Content>
        <Modal.Header><Header>{t('unwrapping_modal.title')}</Header></Modal.Header>
        {!completed && <Modal.Description>{t('unwrapping_modal.description')}</Modal.Description>}
        {!completed && <Modal.Description>
          <Field type="number" min="0" onChange={this.handleChangeWrapValue} defaultValue={this.props.params.amount}/>
        </Modal.Description>}
        {!completed && <Modal.Actions>
          <Button
            primary
            disabled={this.props.isConnecting || this.props.isUnwrappingMana || !this.state?.value}
            loading={this.props.isConnecting || this.props.isUnwrappingMana}
            onClick={this.handleWrapMana}
          >{t('unwrapping_modal.action')}</Button>
        </Modal.Actions>}
        {completed && <Modal.Description>{t('unwrapping_modal.completed')}</Modal.Description>}
        {completed && <Modal.Actions>
          <Button onClick={this.handleClose}>{t('general.close')}</Button>
        </Modal.Actions>}
      </Modal.Content>
    </Modal>
  }
}

import { Fragment, useRef } from 'react'
import clsx from 'clsx'

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb'
import { Heading } from '@/components/shared/heading/Heading'

import './TransferToAgent.scss'
import { Form, FormInstance, Input, Select } from 'antd'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/store/hooks'
import { transferFundChipsToAffiliate, transferFundChipsToSubAffiliate } from '../../store/action'
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history'
import { useConfirmationContext } from '@/components/shared/confirmation'
import { useBusyContext } from '@/components/shared/busy'
import { sleep } from '@/core/sleep'

const Page = () => {
  const formRef = useRef<FormInstance>(null)
  const { showBusy, hideBusy } = useBusyContext()
  const { showConfirm } = useConfirmationContext()
  const dispatch = useAppDispatch()
  const nav = useNavigate()

  const handleSubmit = async (values: any) => {
    const valid = await formRef.current?.validateFields()
    if (!valid) return
    await showConfirm({message: 'Are you sure you want to transfer the amount?'})
    try {
      showBusy()
      const transferSubAffiliate = await dispatch(transferFundChipsToSubAffiliate(values))
      console.log("transferSubAffiliate: ", transferSubAffiliate);
      if (transferSubAffiliate.payload) {
        showConfirm({message: 'Chips Transfer Successful !!'})
      }
      // nav('/transferHistoryAffiliate')
    } finally {
      hideBusy()
    }
  }
  return (
    <Fragment>
      <div className="transfer-to-agent-content">
        <Breadcrumb />

        <Heading
          title="Transfer Chips To Sub-Agent"
          type="info"
          solid={true}
        />

        <div className="transfer-to-agent-content__wrapper">
          <Form
            ref={formRef}
            labelCol={{md: 10}}
            onFinish={handleSubmit}
            initialValues={{
              transactionType: 'Credit'
            }}
          >
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Sub-Agent ID:'
                  name={'transferTo'}
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Player ID is required' }]}
                >
                  <Input/>
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Number of Chips:'
                  name={'amount'}
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Number of Chips is required' }]}
                >
                  <Input
                    type='number'
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Transaction Type:'
                  name={'transactionType'}
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Transaction Type is required' }]}
                >
                  <Select
                    options={TransactionTypes}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Comment:'
                  name={'description'}
                >
                  <Input/>
                </Form.Item>
              </div>
            </div>

            <div className="form-buttons">
              <div className="row">
                <div className="col-md-9 offset-md-3">
                  <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                  <button type="button" onClick={() => nav(-1)} className="btn grey">Cancel</button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Fragment>
  )
}

export default Page;
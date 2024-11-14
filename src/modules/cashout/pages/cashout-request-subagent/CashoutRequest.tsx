import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './CashoutRequest.scss';
import { Form, FormInstance, Input, Radio, Select, Space } from 'antd';
import { TransferTypes } from '@/modules/bonus-chip/models/instantBonusHistory';
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';
// import { transferFundChips } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { listOneAffiliate } from '../../store/action';

const Page = () => {
  const formRef = useRef<FormInstance>(null);
  const { showBusy, hideBusy } = useBusyContext();
  const { showConfirm } = useConfirmationContext();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const res = await dispatch(listOneAffiliate({}));
    setUser(res.payload[0]);
  }

  const transactionTypes = [
    {
      label: 'Real Chips',
      value: 'Real Chips'
    },
    {
      label: 'Profit Chips',
      value: 'Profit Chips'
    }
  ]

  const handleSubmit = async (values: any) => {

    const valid = await formRef.current?.validateFields();
    if (!valid) return;
    await showConfirm({message: 'Are you sure you want to transfer the amount?'})
    try {
      showBusy();
      // await dispatch(transferFundChips(values));
      nav('/transferHistoryPlayer')
    } finally {
      hideBusy();
    }
  }
  return (
    <Fragment>
      <div className="common-content">
        <Breadcrumb />

        <Heading
          title="CASHOUT REQUEST SUB-AGENT"
          type="info"
        />

        <div className="common-content__wrapper">
          <Form
            ref={formRef}
            labelCol={{md: 10}}
            onFinish={handleSubmit}
            initialValues={{
              transactionType: 'Real Chips'
            }}
          >
            
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Total Chips Available:'
                  name={'transferTo'}
                  requiredMark='optional'
                  // rules={[{ required: true, message: 'Enter Amount is required' }]}
                >
                  <Input
                    type='number'
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Profit:'
                  name={'amount'}
                  requiredMark='optional'
                >
                  <Input
                    type='number'
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-7'>
                <Form.Item
                  label='Number of Chips:'
                  name={'description'}
                >
                  <Input/>
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
                    options={transactionTypes}
                  />
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
};

export default Page;
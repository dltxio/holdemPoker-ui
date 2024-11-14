import { Fragment, useRef } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './TransferToPlayer.scss';
import { Form, FormInstance, Input, Select } from 'antd';
import { TransferTypes } from '@/modules/bonus-chip/models/instantBonusHistory';
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';
import { transferFundChips } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { getCurrentUserData } from "@/helpers/common";
import { showAlert } from '@/store/global/action';

const Page = () => {
  const formRef = useRef<FormInstance>(null);
  const { showBusy, hideBusy } = useBusyContext();
  const { showConfirm } = useConfirmationContext();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const currentUser = getCurrentUserData();

  const handleSubmit = async (values: any) => {
    console.log("values: ", values);

    const valid = await formRef.current?.validateFields();
    if (!valid) return;
    await showConfirm({ message: 'Are you sure you want to transfer the amount?' })
    try {
      showBusy();
      const resData = await dispatch(transferFundChips(values));
      if (resData.payload) {
        dispatch(showAlert({ title: "Chips Transfer Successful!!" }))
        nav('/transferHistoryPlayer')
      }
    } finally {
      hideBusy();
    }
  }
  return (
    <Fragment>
      <div className="transfer-to-player-content">
        <Breadcrumb />

        <Heading
          title="Transfer Chips"
          type="info"
          solid={true}
        />

        <div className="transfer-to-player-content__wrapper">
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
                  label='Player ID:'
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
                rules={[
                  { required: true, message: 'Number of Chips is required' },
                  {
                    validator: (_, value) => {
                      const numberValue = Number(value);
                      if (isNaN(numberValue) || numberValue <= 0) {
                        return Promise.reject('Number of Chips must be greater than 0');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type='number' />
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
                  <button
                    type="submit"
                    className={clsx('btn', 'info')}
                  >Submit</button>
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
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
import { listOneAffiliate, listAffiliateWithUserName } from '../../store/action';
import { createAffilateWithDrawlRequest, createAffilateWithDrawlRequestWithInvoiceId } from "../../../cashout/store/action";
import { showAlert } from '@/store/global/action';

const Page = () => {
  const formRef = useRef<FormInstance>(null);
  const { showBusy, hideBusy } = useBusyContext();
  const { showConfirm } = useConfirmationContext();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<number>(0);
  const [amountChip, setAmountChip] = useState(0);
  const [amountRake, setAmountRake] = useState(0);
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    const res = await dispatch(listAffiliateWithUserName({}));
    setUser(res.payload.result);
    
    const role = res.payload.result[0].role.level;

    setUserRole(role);
    // setAmountChip(res.payload.result[0].realChips)
    setAmountRake(res.payload.result[0].profit.toFixed(2))
  }

  const handleSubmit = async (values: any) => { 
    const userData: any = user;
    console.log("userData: ", userData);

    const valueData = {
      ...values,
      withdrawalType: values.totalAmountRake === 2 ? "rakeAmount" : "realChips",
      totalAmountChips: userData[0].realChips || 0,
      totalAmountRake: JSON.stringify(userData[0].profit) || 0,
      currentDepositAmount: 0,
      tds: 0,
      netAmount: 0,
      affiliateId: userData[0].userName,
      affiliateMobile: userData[0].mobile,
      profile: userData[0].role.level <= 0 ? userData[0].role.name : "AFFILIATE",
      requestedAt: Number(new Date()),
      roleName: userData[0].role.name,
      requestedAmount: JSON.parse(values.requestedAmount)
    }
    const valid = await formRef.current?.validateFields();
    if (!valid) return;
    await showConfirm({message: 'Are you sure you want to transfer the amount?'})
    try {
      showBusy();
      if (userData[0].role.level <= 0) {
        const resData = await dispatch(createAffilateWithDrawlRequestWithInvoiceId(valueData));
        if (resData.payload) {
          dispatch(showAlert({ title: 'success', content: "Cashout request raised successfully!" }))
          nav('/cashoutHistory')
        }
      } else {
        const resData = await dispatch(createAffilateWithDrawlRequest(valueData));
        if (resData.payload) {
          dispatch(showAlert({ title: 'success', content: "Cashout request raised successfully!" }))
          nav('/pendingCashOutAffiliate')
        }
      }
    } finally {
      hideBusy();
    }
  }
  return (
    
    <Fragment>
      <div className="common-content">
        <Breadcrumb />

        <Heading
          title="CASHOUT"
          type="info"
        />

        <div className="common-content__wrapper">
          <Form
            ref={formRef}
            labelCol={{md: 10}}
            onFinish={handleSubmit}
            initialValues={{
              transactionType: 'Credit'
            }}
          >
            <div className='row'>
              <div className='col-md-7 offset-3'>
                <Form.Item
                  name={'totalAmountRake'}
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Please select Withdraw Type' }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={1}>Chips available for cashout {amountChip}</Radio>
                      <Radio value={2}>Rake commission available for cashout {amountRake}</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                {/* <Form.Item
                  name={'transferTo'}
                  requiredMark='optional'
                  rules={[{ required: true, message: 'Enter Amount is required' }]}
                >
                </Form.Item> */}
              </div>
            </div>
            {userRole <= 0 ? (
              <>
                <div className='row'>
                  <div className='col-md-7'>
                    <Form.Item
                      label='Enter Amount:'
                      name={'requestedAmount'}
                      requiredMark='optional'
                      rules={[{ required: true, message: 'Enter Amount is required' }]}
                    >
                      <Input type='number'/>
                    </Form.Item>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-7'>
                    <Form.Item
                      label='Invoice ID'
                      name={'invoiceId'}
                      requiredMark='optional'
                      rules={[{ required: true, message: 'InvoiceId is required' }]}
                    >
                      <Input/>
                    </Form.Item>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-7'>
                    <Form.Item
                      label='Account Type:'
                      name={'accountType'}
                      requiredMark='optional'
                      rules={[{ required: true, message: 'Account Type is required' }]}
                    >
                      <Select
                        options={TransactionTypes}
                      />
                    </Form.Item>
                  </div>
                </div>
              </>
            ): (
                <>
                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Enter Amount:'
                        name={'requestedAmount'}
                        requiredMark='optional'
                        rules={[{ required: true, message: 'Enter Amount is required' }]}
                      >
                        <Input type='number'/>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Name on Account:'
                        name={'name'}
                        requiredMark='optional'
                        rules={[{ required: true, message: 'Name on Account is required' }]}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Account Type:'
                        name={'accountType'}
                        requiredMark='optional'
                        rules={[{ required: true, message: 'Account Type is required' }]}
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
                        label='Account Number:'
                        name={'accountNumber'}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Confirm Account Number:'
                        name={'accountNumberConfirm'}
                        rules={[
                          {required: true, message: 'Account number not valid'}
                        ]}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='IFSC Code:'
                        name={'ifcsCode'}
                        rules={[
                          {required: true, message: 'Please provide valid IFSC code.'}
                        ]}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Bank Name:'
                        name={'bankName'}
                        rules={[
                          {required: true, message: 'Bank name is required.'}
                        ]}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-7'>
                      <Form.Item
                        label='Branch Name:'
                        name={'branchName'}
                        rules={[
                          {required: true, message: 'Branch name is required.'}
                        ]}
                      >
                        <Input/>
                      </Form.Item>
                    </div>
                  </div>
                </>
            )}

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
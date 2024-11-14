import { Fragment, useState } from 'react';
import { DatePicker, Input, Select, Button, InputNumber, Form } from 'antd';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';

import './GenerateCardAffiliate.scss';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';
import { getCurrentUserData } from '@/helpers/common';
import { ICreatedBy } from '@/modules/user/interfaces/CreateAgent.interface';
import { showAlert } from '@/store/global/action';
import { createScratchCardAffiliate } from '../../store/action';
import dayjs from 'dayjs';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Page = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const cf = useConfirmationContext();
  const [form] = Form.useForm();
  const [dataTable, setDataTable] = useState(
    [{ denomination: 5000, quantity: 0 },
    { denomination: 10000, quantity: 0 },
    { denomination: 20000, quantity: 0 },
    { denomination: 50000, quantity: 0 },
    { denomination: 100000, quantity: 0 }]
  );
  const [total, setTotal] = useState(0);
  const handleInputChange = (value: number, index: number) => {
    dataTable[index].quantity = value;
    const total = dataTable.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.denomination * currentValue.quantity;
    }, 0)
    setTotal(total);
    setDataTable([...dataTable])
  }
  const handleSubmit = async (values: any) => {

    try {
      if (total === 0) {
        return;
      }
      bs.showBusy();
      const currentUser = getCurrentUserData();
      const createdBy: ICreatedBy = {
        name: currentUser.name,
        userName: currentUser.userName,
        role: currentUser.role,
        id: currentUser.email
      };

      const date = new Date(values.expiresOn)
      const res = await d(createScratchCardAffiliate({
        ...values,
        expiresOn: Number(date.setDate(date.getDate() + 1)) - 1000,
        isActive: true,
        createdBy,
        scratchCardType: "AFFILIATE",
        scratchCardDetails: dataTable,
        totalAmount: total
      }));
      if (res.payload?.status === 200) {
        d(showAlert({ title: `Scratch card created successfully.` }))
        resetForm();
      } else {
        d(showAlert({ title: res.payload.info }))
      }
    } finally {
      bs.hideBusy();
    }
  }
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return !dayjs(current).isToday() && dayjs().isAfter(dayjs(current));
  };

  const resetForm = () =>{
    form.resetFields();
    setDataTable([...dataTable.map(item=>({
      ...item,
      quantity: 0
    }))]);
    setTotal(0);
  }

  // const handleCancel = () =>{
  //   nav()
  // }

  return (
    <Fragment>
      <div className="generate-card-affiliate-content">
        <Breadcrumb />

        <div className="generate-card-affiliate-content__section">
          <div className="generate-card-affiliate-content__section__title">
            <h1>Agent</h1>
          </div>
          <Form autoComplete="off"
            onFinish={handleSubmit}
            form={form}
          >

            <div className="generate-card-affiliate-content__section__filter">
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <Form.Item
                    name='expiresOn'
                    className='mb-0'
                    requiredMark='optional'
                    rules={[{ required: true, message: 'Please provide valid Expires On.' }]}
                  >
                    <DatePicker
                      disabledDate={disabledDate}
                      className="default form-control"
                      suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                      allowClear={false}
                      placeholder="EXPIRES ON"
                    />
                  </Form.Item>
                </div>

                <div className="col-md-4 col-sm-12">
                  <Form.Item name="affiliateId" className='mb-0'
                    rules={[
                      { required: true, message: 'Please provide valid Agent ID/Sub-Agent ID' },
                    ]}
                  >
                    <Input className="default" placeholder="Agent ID/Sub-Agent ID" />
                  </Form.Item>
                </div>

                <div className="col-md-4 col-sm-12">
                  <Form.Item name="transactionType" rules={[{ required: true, message: 'Please provide valid Transaction type' }]}>
                    <Select
                      className="default"
                      placeholder="Transaction type"
                      options={[
                        {
                          value: 'Debit',
                          label: 'Debit',
                        },
                        {
                          value: 'Credit',
                          label: 'Credit',
                        },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="generate-card-affiliate-content__section__table">
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Denomination</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {dataTable.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Input className="default" value={item.denomination} disabled />
                      </td>
                      <td>
                        <InputNumber className="default" value={item.quantity} onChange={(event: any) => handleInputChange(event, index)} min={0} />
                      </td>
                      <td>
                        <Input className="default" disabled value={item.denomination * item.quantity} />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Total: </td>
                    <td><Input className="default" disabled value={total} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="generate-card-affiliate-content__section__buttons">
              <Button className="default" onClick={() => nav('/dashboard')} htmlType="button" >Cancel</Button>
              <Button className="default" htmlType="submit" disabled={total === 0}>Submit</Button>
            </div>
          </Form>

        </div>
      </div>
    </Fragment>
  );
}

export default Page;
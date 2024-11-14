import { Fragment, useRef } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './DirectLeaderboardEntry.scss';
import { Form, FormInstance, Input } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { directEntryPlayer } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useNavigate } from 'react-router';
import { showAlert } from '@/store/global/action';

const Page = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const formRef = useRef<FormInstance>(null);
  const handleSubmit = async (values: any) => {
    try{
      bs.showBusy();
      const res = await d(directEntryPlayer({...values}));
      console.log(res);
      if(res.payload.success){
        d(showAlert({
          content:"Player has sucessfully participated in to the leaderboard !!"
        }));
        formRef.current?.resetFields();
      } else {
        d(showAlert({
          content:res?.payload?.info
        }))
      }
      bs.hideBusy();
    } catch(e){
      console.log(e);
      bs.hideBusy();
    }

  } 
  const handleReset = () =>{
    formRef.current?.resetFields();
  }

  return (
  
    <Fragment>
      <div className="direct-leaderboard-entry-content">
        <Breadcrumb />

        <div className="direct-leaderboard-entry-content__wrapper">
          <Heading
            title={'Direct Leaderboard Entry'}
            icon="bi-award"
            type="info"
          />

          <div className="direct-leaderboard-entry-content__form mt-4">
            <Form
              ref={formRef}
              onFinish={handleSubmit}
              layout="horizontal"
              labelCol={{ span: 10 }}
            >
              <div className="form-item">
                <div className="row">
                  <div className="col-md-7">
                    <Form.Item
                      name='userName'
                      label='Player User Name'
                      requiredMark="optional"
                      rules={[{ required: true, message: 'Please enter valid player username' }]}
                    >
                      <Input
                        placeholder='Player User Name'
                      />
                    </Form.Item>
                  </div>

                  <div className="col-md-7">
                    <Form.Item
                      name='bonusCode'
                      label='Bonus Code'
                      requiredMark="optional"
                      rules={[{ required: true, message: 'Please enter valid bonus code' }]}
                    >
                      <Input
                        placeholder='BONUS CODE'
                        onInput={(e: any) => e.target.value = e.target.value.toUpperCase()}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <div className="row">
                  <div className="col-md-9 offset-md-3">
                    <button type="button" className="btn grey" onClick={handleReset}>Reset</button>
                    <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Page;
import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Heading } from "@/components/shared/heading/Heading";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, FormInstance, InputNumber, Select } from "antd";
import clsx from "clsx";
import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createLoyaltyPoints } from "../../store/action";
import "./Create.scss";
export enum LoyaltyLevelsEnum {
  Bronze = 'Bronze',
  Chrome = 'Chrome',
  Silver = 'Silver',
  Gold = 'Gold',
  Diamond = 'Diamond',
  Platinum = 'Platinum'
}
export const LoyaltyLevels = [
  {
    label: LoyaltyLevelsEnum.Bronze,
    value: LoyaltyLevelsEnum.Bronze
  },
  {
    label: LoyaltyLevelsEnum.Chrome,
    value: LoyaltyLevelsEnum.Chrome
  },
  {
    label: LoyaltyLevelsEnum.Silver,
    value: LoyaltyLevelsEnum.Silver
  },
  {
    label: LoyaltyLevelsEnum.Gold,
    value: LoyaltyLevelsEnum.Gold
  },
  {
    label: LoyaltyLevelsEnum.Diamond,
    value: LoyaltyLevelsEnum.Diamond
  },
  {
    label: LoyaltyLevelsEnum.Platinum,
    value: LoyaltyLevelsEnum.Platinum
  },
]
const Create = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const [disable, setDisable] = useState(false);
  const handleSubmit = async (values: any) => {
    console.log(values)
    try {
      bs.showBusy();
      const res = await d(createLoyaltyPoints(values));
      console.log(res);
      if (res.payload?.status === 400) {
        d(showAlert({
          title: 'Error!',
          content: res.payload?.info
        }))
      } else if (res?.payload?._id) {
        d(showAlert({
          title: 'Success!',
          content: 'Loyalty level created successfully.'
        }))
        handleReset();
      } else {
        d(showAlert({
          title: 'Error!',
          content: 'Getting error from server in creating table'
        }))
      }
    } catch (e) {
      console.log(e);
    } finally {
      bs.hideBusy();
    }
  }
  const handleReset = () => {
    formRef.current?.resetFields();
    formRef.current?.setFieldValue('loyaltyLevel', undefined);
    setDisable(false);
  }
  const handleLevelChange = (value: any) => {
    console.log(value)
    if (value === LoyaltyLevelsEnum.Bronze) {
      formRef.current?.setFieldValue('levelThreshold', 0);
      setDisable(true);
    } else {
      setDisable(false);
    }
  }
  const handleCancel = () => {
    nav('/listLoyaltyPoints')
  }
  return (
    <div className="create-loyalty-point-content">
      <Breadcrumb />

      <div className="create-loyalty-point-content__wrapper">
        <Heading
          title="CREATE LOYALTY POINTS"
          icon="bi-gear"
          type="info"
        />
        <div className="create-loyalty-point-content__form mt-4">
          <Form
            ref={formRef}
            onFinish={handleSubmit}
            layout="horizontal"
            labelCol={{ span: 10 }}
            labelWrap
          >
            <div className="form-item">
              <div className="row">

                <div className="col-md-7">
                  <Form.Item
                    name='loyaltyLevel'
                    label='Loyalty Level'
                  >
                    <Select
                      placeholder='Loyalty Level'
                      options={LoyaltyLevels}
                      onChange={handleLevelChange}
                    />
                  </Form.Item>
                </div>

                <div className="col-md-7">
                  <Form.Item
                    name='levelThreshold'
                    label='Level Threshold Amount (Chips)'
                    rules={[
                      {
                        validator(_, value) {
                          if (value < 0) {
                            return Promise.reject(new Error('Please provide a valid threshold amount.'));
                          }
                          return Promise.resolve();
                        },
                      }
                    ]}
                  >
                    <InputNumber disabled={disable} min={0} />
                  </Form.Item>
                </div>

                <div className="col-md-7">
                  <Form.Item
                    name='percentReward'
                    label='Percent Reward'
                    rules={[
                      {
                        validator(_, value) {
                          if (value < 1) {
                            return Promise.reject(new Error('Please provide valid percent reward.'));
                          }
                          return Promise.resolve();
                        },
                      }
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </div>

              </div>
            </div>
            <div className="form-buttons">
              <div className="row">
                <div className="col-md-9 offset-md-3">
                  <button type="button" className="btn grey" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
};

export default Create;
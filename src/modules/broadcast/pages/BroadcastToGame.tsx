import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Heading } from "@/components/shared/heading/Heading";
import { Textarea } from "@/components/shared/textarea/Textarea";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, FormInstance, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import clsx from "clsx";
import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BroadcastToEnum, BroadcastToList, ChannelVariation, ChipsType } from "../models/BroadcastToGame";
import { broadcastToGame, listTable } from "../store/action";
import "./BroadcastToGame.scss";

const Page = () => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const bs = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const [broadcastType, setBroadcastType] = useState('');
  const [tables, setTables] = useState<any[]>([]);
  const handleSubmit = async (values: any) => {
    try{
      let params;
    if (values.broadcastType === BroadcastToEnum.table) {
      params = {
        broadcastType: values.broadcastType,
        heading: values.heading,
        broadcastMessage: values.broadcastMessage,
        channelId: values.channelId
      }
    } else {
      params = {
        broadcastType: values.broadcastType,
        heading: values.heading,
        broadcastMessage: values.broadcastMessage,
      }
    }
    const res: any = await d(broadcastToGame(params));
      console.log(res);
      if (res.payload.success) {
        d(showAlert({ title: `Broadcast sent successfully.` }))
      } else {
        d(showAlert({ title: `${res.payload.info}` }))
      }
    }catch(e){
      d(showAlert({
        title:'"Error!',
        content: "Getting error from server in sending broadcast"
      }))
    }
  }
  const handleToChange = (value: string) => {
    setBroadcastType(value)
  }
  const handleCancel = () => {

  }
  const handleGetTable = async () => {
    try {
      const formValues = {
        ...formRef.current?.getFieldsValue()
      }
      let params: any = {
        channelType: 'NORMAL',
        isActive: true,
        limit: 0,
        skip: 0
      };
      if (formValues.channelVariation) {
        params.channelVariation = formValues.channelVariation;
      }
      if (formValues.isRealMoney !== undefined) {
        params.isRealMoney = formValues.isRealMoney;
      }
      const res = await d(listTable(params));
      if (res.payload?.length > 0) {
        const list = res.payload.map((table: any) => ({
          value: table._id,
          label: table.channelName
        }));
        setTables(list);
      } else {
        setTables([]);
      }

    } catch (e) {

    }
  }
  return (
    <div className="broadcast-content">
      <Breadcrumb />

      <div className="broadcast-content__wrapper secondary">
        <Heading
          title="SEND BROADCAST"
          type="info"
          solid={true}
        />
        <div className="broadcast-content__form mt-4">
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
                    name='broadcastType'
                    label='Broadcast to'
                  >
                    <Select
                      placeholder='Please select'
                      options={BroadcastToList}
                      onChange={handleToChange}
                    />
                  </Form.Item>
                </div>
                {
                  broadcastType === BroadcastToEnum.table &&
                  <Fragment>
                    <div className="col-md-7">
                      <Form.Item
                        name='channelVariation'
                        label='Channel Variation'
                      >
                        <Select
                          placeholder='Please select'
                          options={ChannelVariation}
                          onChange={handleGetTable}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-7">
                      <Form.Item
                        name='isRealMoney'
                        label='Chips Type'
                      >
                        <Select
                          placeholder='Please select'
                          options={ChipsType}
                          onChange={handleGetTable}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-7">
                      <Form.Item
                        name='channelId'
                        label='Select table'
                      >
                        <Select
                          placeholder='Please select'
                          options={tables}
                        />
                      </Form.Item>
                    </div>
                  </Fragment>
                }

                <div className="col-md-7">
                  <Form.Item
                    name={"heading"}
                    label="Broadcast Heading"
                    rules={[
                      {
                        required: true,
                        message: 'Broadcast Heading is required'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-7">
                  <Form.Item
                    name={"broadcastMessage"}
                    label="Broadcast Message"
                    rules={[
                      {
                        required: true,
                        message: 'Broadcast Message is required'
                      }
                    ]}
                  >
                    <TextArea placeholder="Max. 500 characters." rows={6} maxLength={500}>

                    </TextArea>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="form-buttons">
              <div className="row">
                <div className="col-md-9 offset-md-3">
                  <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                  <button type="button" className="btn grey" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
};

export default Page;
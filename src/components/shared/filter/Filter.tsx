import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Form, FormInstance, FormItemProps, FormProps, Input, InputProps, Modal, Select, SelectProps } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../button/Button';
import { useBusyContext } from '../busy';

import './Filter.scss';

export enum FilterInputType {
  Input = 'input',
  Date = 'date',
  DateRange = 'dateRange',
  Select = 'select',
}

const Inputs = {
  [FilterInputType.Input]: Input,
  [FilterInputType.Select]: Select,
  [FilterInputType.Date]: DatePicker,
  [FilterInputType.DateRange]: DatePicker.RangePicker,
}

type AllInputProps = {
  [FilterInputType.Input]: InputProps,
  [FilterInputType.Select]: SelectProps,
  [FilterInputType.Date]: DatePickerProps,
  [FilterInputType.DateRange]: RangePickerProps,
}

export type FilterItem = {
  [K in keyof AllInputProps]: FormItemProps & {
    name: string,
    type: FilterInputType,
    label?: string,
    inputProps?: AllInputProps[K]
  }
}[keyof AllInputProps]

export type FilterProps = FormProps & {
  items: FilterItem[],
  onExport?: () => void,
  onReset?: () => void,
  onExportAll?: () => void,
  onCurrentCycle?:() => void,
  onSendFileToMail?: (values: any) => Promise<any>,
  hideAllActions?: boolean,
  customRenderTitle?: React.FC<any>
}

const renderFilterItem = ({ type, label, name, inputProps, ...itemProps }: FilterItem, idx: number) => {
  const Input = Inputs[type] as any;
  let props = { ...inputProps };
  const total = (itemProps as any).total > 3 ? 3 : (itemProps as any).total;
  const maxWidth = (100 / total) - 9.56;

  if (type === FilterInputType.Date || type === FilterInputType.DateRange) {
    props = {
      ...props,
      allowClear: false,
      suffixIcon: <FontAwesomeIcon icon={faCalendarDays} />
    }
  }

  return (
    <div className="field" key={`filter-field-${idx}`} style={{ maxWidth: `${maxWidth}%` }}>
      <Form.Item
        name={name}
        label={label}
        {...itemProps}
      >
        <Input
          {...props}
        />
      </Form.Item>
    </div>
  )
}

const RenderTitle: React.FC<any> = ({ customRenderTitle: CustomRenderTitle }) => {
  return CustomRenderTitle &&
    <CustomRenderTitle />
}
export const FilterForm = React.forwardRef<FormInstance, FilterProps>(({
  items, onExport, onReset, onCurrentCycle, onExportAll, onSendFileToMail, hideAllActions, customRenderTitle, ...props
}, ref) => {
  const bs = useBusyContext();
  const [innerItems, setInnerItems] = useState<any>([]);
  const [initialValues, setInitialValues] = useState();
  const [isOpenSendMail, setOpentSendMail] = useState(false);
  const [isSendEmailSucss, setSendEmailSuccess] = useState(false);
  const sendMailFormRef = useRef<FormInstance>(null);

  useEffect(() => {
    setInitialValues(
      items.reduce((prev, item) => {
        prev[item.name] = item.inputProps?.defaultValue || item.inputProps?.value || '';
        return prev;
      }, {} as any)
    );
  }, []);

  useEffect(() => {
    const total = items.length;
    setInnerItems(items.map(item => ({ ...item, total })))
  }, [items]);

  const onSendMail = () => {
    sendMailFormRef.current?.submit();
  }

  const handleSendMail = async () => {
    // sendMailFormRef.current?.submit();
    if (onSendFileToMail) {
      try {
        bs.showBusy();
        await onSendFileToMail(sendMailFormRef.current?.getFieldsValue());
        setSendEmailSuccess(true);
      } finally {
        bs.hideBusy();
      }
    }
  }

  return (
    <div className="filter-form">
      <RenderTitle customRenderTitle={customRenderTitle} />
      <Form
        className="default"
        ref={ref}
        initialValues={initialValues}
        {...props}
      >
        <div className="fields">
          {innerItems.map(renderFilterItem)}
          {!hideAllActions && <div className="filter-form__btns">
            <Button
              htmlType='submit'
              text="Search"
              type="info"
              rounded={true}
              icon="bi-pencil-square"
              solid={true}
            />

            <Button
              text="Reset"
              type="info"
              rounded={true}
              onClick={onReset}
              icon="bi-pencil-square"
              solid={true}
            />

            {onExport && <Button
              text="Export to CSV"
              type="info"
              rounded={true}
              onClick={onExport}
              icon="bi-pencil-square"
              solid={true}
            />}

            {onCurrentCycle && <Button
              text="Current Cycle"
              type="info"
              rounded={true}
              onClick={onCurrentCycle}
              icon="bi-pencil-square"
              solid={true}
            />}

            {onExportAll && <Button
              text="Export All"
              type="info"
              rounded={true}
              onClick={onExportAll}
              icon="bi-pencil-square"
              solid={true}
            />}

            {onSendFileToMail && <Button
              text="Send file to mail"
              type="info"
              rounded={true}
              onClick={() => setOpentSendMail(true)}
              icon="bi-pencil-square"
              solid={true}
            />}
          </div>}
        </div>
      </Form>
      <Modal
        title="Enter Email ID"
        open={isOpenSendMail}
        onOk={onSendMail}
        okText="Proceed"
        onCancel={() => setOpentSendMail(false)}
      >
        <div className='text-center'>
          <i className={`fa ${isSendEmailSucss ? 'fa-check text-success' : 'fa-info-circle'}`} style={{ fontSize: '4rem' }}></i>
          <Form
            ref={sendMailFormRef}
            className='mt-5'
            onFinish={handleSendMail}
          >
            <Form.Item
              name={'email'}
              className='mb-0 text-left'
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input
                placeholder='Email ID'
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
});
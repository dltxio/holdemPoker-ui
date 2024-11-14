import { Fragment, useRef, useState } from 'react';
import { Form, FormInstance, Switch } from 'antd';
import { useAppDispatch } from '@/store/hooks';

// Actions
import { listPlayerForBuildAcess, updatePlayerBuildAcess } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { PageTitle } from '@/components/shared/page-title/PageTitle';
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { FilterForm, FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useBusyContext } from '@/components/shared/busy';

import './PlayerBuildAccess.scss';

const items: FilterItem[] = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    rules: [
      { required: true }
    ],
    inputProps: {
      placeholder: 'Username'
    }
  },
  {
    name: 'email',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Email ID'
    }
  },
  {
    name: 'mobile',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Mobile No.'
    }
  }
]

const Page = () => {
  const d = useAppDispatch();
  const bs = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const filterFormRef = useRef<FormInstance>(null);
  const [data, setData] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<any>(null);

  const onSubmit = async (values: any) => {
    const valid = await filterFormRef.current?.validateFields();
    if (!valid) return;
    try {
      bs.showBusy();
      const res = await d(listPlayerForBuildAcess({
        ...values
      }));
      const item = res.payload[0];
      if (item) {
        setData(item);
        setInitialValues(item.buildAccess);
        formRef.current?.setFieldsValue(item.buildAccess)
      } else {
        setData(null);
      }
    } finally {
      bs.hideBusy()
    }
  };

  const onUpdate = async (changes: any, values: any) => {
    try {
      bs.showBusy();
      await d(updatePlayerBuildAcess({
        buildAccess: values,
        _id: data?._id
      }));
      d(showAlert({
        title: 'Player builds updated sucessfully'
      }))
    } finally {
      bs.hideBusy()
    }
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    setData(null);
  };

  return (
    <Fragment>
      <div className="player-build-access-content">
        <PageTitle text="Player Build Access" />

        <Breadcrumb />

        <Heading
          title="Player Build Access"
          type="info"
          solid={true}
        />

        <FilterForm
          ref={filterFormRef}
          items={items}
          onFinish={onSubmit}
          onReset={handleOnReset}
          className={'mt-5'}
        />

        {data && <>
          <h2 className='mt-5'>Player Builds</h2>
          <Form
            ref={formRef}
            labelCol={{
              md: 2
            }}
            onValuesChange={onUpdate}
            initialValues={initialValues}
          >
            <Form.Item
              label='Android:'
              name={'androidApp'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label='IOS:'
              name={'iosApp'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label='MacOS'
              name={'mac'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label='Browser'
              name={'browser'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label='Windows:'
              name={'windows'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label='Website:'
              name={'website'}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </>}
      </div>
    </Fragment>
  )
};

export default Page;
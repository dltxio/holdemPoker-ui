import { Fragment, useRef, useState } from 'react';
import clsx from 'clsx';
import { DatePicker, Form, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './ChipReportChart.scss';
import Input from 'antd/lib/input/Input';
import { Bar } from 'react-chartjs-2';
// import { useAppDispatch } from '@/store/hooks';
// import { findPlayerDataChart } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';

export type ChipReportChartViewProps = {
  title: string,
  loadData: (values: any) => Promise<Array<{
    label: string,
    value: number
  }>>
} 

const ChipReportChartView = ({ title, loadData }: ChipReportChartViewProps) => {
  const busy = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    const valid = await formRef.current?.validateFields();
    if (!valid) return;
    try {
      busy.showBusy();
      const res = await loadData({
        ...values,
      });

      setData({
        datasets: [
          {
            label: 'Month',
            data: res.map((x) => x.value),
            barThickness: 25,
            maxBarThickness: 25,
            backgroundColor: '#32c5d2'
          }
        ],
        labels: res.map((x) => x.label)
      })

    } finally {
      busy.hideBusy();
    }
  }
  return (
    <Fragment>
      <div className="player-chart-content">
        <Breadcrumb />

        <Heading
          title={title}
          type="info"
          solid={true}
        />

        <div className="player-chart-content__wrapper">
          <Form
            ref={formRef}
            labelCol={{
              md: 10
            }}
            onFinish={handleSubmit}
          >
            <div className="row">
              <div className="col-md-7">
                {/* <Form.Item
                  name={'userName'}
                  label='Player Username'
                >
                  <Input/>
                </Form.Item> */}
                <Form.Item
                  name={'date'}
                  label='Month'
                >
                  <DatePicker
                    className="default"
                    placeholder="Select month"
                    suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                    allowClear={false}
                    picker="month"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="form-buttons">
              <div className="row">
                <div className="col-md-9 offset-md-3">
                  <button type="submit" className={clsx('btn', 'info')}>Submit</button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      {data && <div>
        <Bar
          data={data}
        />
      </div>}
    </Fragment>
  )
};

export default ChipReportChartView;
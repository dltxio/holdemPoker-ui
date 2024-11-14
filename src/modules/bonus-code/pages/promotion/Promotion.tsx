import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Button } from "@/components/shared/button/Button";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { Heading } from "@/components/shared/heading/Heading";
import { PaginationProps } from "@/components/shared/pagination/Pagination";
import { Table, TableColumnType } from "@/components/shared/table/Table";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Form, Input, InputNumber } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { addPromotionalBonus, listPromotionalBonus, removePromotionalBonus } from "../../store/action";
import "./Promotion.scss";
export const PAGE_SIZE = 20;
const Actions = ({ row, reload }: any) => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();

  const handleDelete = async () => {
    try {
      showBusy();
      await dispatch(removePromotionalBonus({
        id: row._id
      }));
      reload && reload();
      dispatch(showAlert({
        title: 'Promocode deleted sucessfully!!',
      }))
      hideBusy();
    } catch (e) {
      console.log(e);
      hideBusy();
    }

  }
  return (
    <Fragment>
      <Button
        text="Delete"
        type="danger"
        rounded={true}
        icon="bi-pencil-square"
        onClick={handleDelete}
      />
    </Fragment>
  );
}

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Promo Code',
    dataIndex: 'promoCode'
  },
  {
    title: 'Amount',
    dataIndex: 'amount'
  },
  {
    title: 'Date And Time',
    dataIndex: 'date',
    customRender: ({ row, value }) => {
      return <span>{dayjs(value).format('MMM DD,YYYY h:mm:ss A')}</span>
    }
  },
  {
    title: 'Action',
    dataIndex: '',
    customRender: (props) => <Actions {...props} />
  },
]
const Promotion = () => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();
  const [form] = Form.useForm();
  const tableRef = useRef<any>(null);

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });

  const [data, setData] = useState<any>({});
  const [displayData, setDisplayData] = useState<any>([]);

  const columns = useMemo(() => [
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Promo Code',
      dataIndex: 'promoCode'
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Date And Time',
      dataIndex: 'date',
      customRender: ({ row, value }: any) => {
        return <span>{dayjs(value).format('MMM DD,YYYY h:mm:ss A')}</span>
      }
    },
    {
      title: 'Action',
      dataIndex: '',
      customRender: (props: any) => <Actions {...props} reload={() => load()} />
    },
  ],[])
  const handleSubmit = async (values: any) => {
    try {
      showBusy();
      await dispatch(addPromotionalBonus(values));
      dispatch(showAlert({
        title: 'Promocode added sucessfully!!',
      }));
      load();
      form.resetFields();
    } catch (e) {
      console.log(e);
    } finally {
      hideBusy();
    }
  }

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    const result = data.result;
    if (result && Array.isArray(result)) {
      const pageSize = pagination.pageSize || PAGE_SIZE;
      const list = result.slice(pageSize * (current - 1), pageSize * current);
      setDisplayData(list);
    }
  };

  const load = async () => {
    try {
      showBusy();

      const res: any = await dispatch(listPromotionalBonus({}));
      setData(res.payload);
      const result = res.payload.result;
      if (result && Array.isArray(result)) {
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = result.slice(pageSize * (current - 1), pageSize * current);
        setDisplayData(list);
      }
      setPagination({
        ...pagination,
        total: res.payload.result.length
      });
    } finally {
      hideBusy();
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Fragment>
      <div className="promotion-content">
        <Breadcrumb />

        <div className="promotion-content__wrapper">
          <Heading
            title="Promotional Bonus"
            type="info"
            solid={true}
          />
          <Form
            form={form}
            labelCol={{
              md: 10
            }}
            onFinish={handleSubmit}
          >
            <div className="row">
              <div className="col-md-3">
                <Form.Item name='promoCode' rules={[{ required: true, message: 'Promo Code is required' }]}>
                  <Input placeholder="Promo Code" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name='amount' rules={[
                  { required: true, message: 'Amount is required' },
                  {
                    validator(_, value) {
                      if (value < 1) {
                        return Promise.reject(new Error('Amount cannot be less than 1.'));
                      }
                      return Promise.resolve();
                    },
                  }
                ]}>
                  <InputNumber placeholder="Amount" min={0} />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <div className="form-buttons">
                  <Button type="info" text="Add"
                    rounded={true} htmlType="submit"
                    icon="bi-pencil-square" solid={true} />
                  <Button type="info" text="Reset"
                    rounded={true}
                    icon="bi-pencil-square" solid={true} htmlType="reset" />
                </div>
              </div>
            </div>
          </Form>

          <Table
            ref={tableRef}
            columns={columns}
            pagination={pagination}
            data={displayData || []}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default Promotion;
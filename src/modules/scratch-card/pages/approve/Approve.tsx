import { Button } from "@/components/shared/button/Button";
import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import { showAlert } from "@/store/global/action";
import { FormInstance, Input, Modal, Radio, RadioChangeEvent, Space } from "antd";
import { unwrapResult } from '@reduxjs/toolkit';
import { useBusyContext } from "@/components/shared/busy";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router";
import { Fragment, useMemo, useRef, useState } from "react";
import TableReport from "@/components/table-report/TableReport";
import { approveScratchCard, getScratchCardList, getScratchCardListCount, rejectScratchCard } from "../../store/action";
import { getCurrentUserData } from "@/helpers/common";
import { ICreatedBy } from "@/modules/user/interfaces/CreateAgent.interface";
import { Form } from "react-router-dom";
import { Heading } from "@/components/shared/heading/Heading";
import clsx from "clsx";
import './Approve.scss';
const Actions = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const cf = useConfirmationContext();
  const bs = useBusyContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const handleReject = async () => {

    try {
      try {
        if(!value){
          return;
        }
        bs.showBusy();

        const currentUser = getCurrentUserData();
        const issuedBy: ICreatedBy = {
          name: currentUser.name,
          userName: currentUser.userName,
          role: currentUser.role,
          id: currentUser.email
        };

        const res = await d(rejectScratchCard({ ...row, issuedBy, reasonOfRejection: value }));
        d(showAlert({ title: `The scratch card was rejected!` }))
        reload && reload();
      } finally {
        bs.hideBusy();
      }
    } finally {
      setOpen(false)
      
      bs.hideBusy();
    }
  }

  const handleApprove = async () => {
    console.log("handleApprove",row)
    try {
      bs.showBusy();
      // unwrapResult(await d(revertTable({
      //   _id: id
      // })));
      const currentUser = getCurrentUserData();
      const issuedBy: ICreatedBy = {
        name: currentUser.name,
        userName: currentUser.userName,
        role: currentUser.role,
        id: currentUser.email
      };

      const res = await d(approveScratchCard({ ...row, issuedBy }));
      d(showAlert({ title: `Scratch cards generated successfully!` }))
      // if (res.payload?.status === 200) {
      //   d(showAlert({ title: `Scratch cards generated successfully!` }))
      //   // form.resetFields()
      // } else {
      //   d(showAlert({ title: res.payload.info }))
      // }
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const handleOk = () => {

  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };


  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className='d-flex' style={{ width: 330 }}>
      <Space
        size={5}
        direction='horizontal'
        wrap
      >
        <Button
          text="Approve"
          type="info"
          rounded={true}
          onClick={handleApprove}
          icon="bi-pencil"
        />
        <Button
          text="Reject"
          type="danger"
          rounded={true}
          onClick={() => setOpen(true)}
          icon="bi-arrow-return-right"
        />
      </Space>
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Procced"
        footer={null}
        closable={false}
      >
        <div className="reject-content">
          <div className="reject-content__wrapper">
            <Heading
              title="Reason for rejection?"
              type="info"
            />
            <div className="reject-content__form mt-3">
              <Form>
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value={"Exceeding credit limit"}>Exceeding credit limit</Radio>
                    <Radio value={"Exceeding legal limit"}>Exceeding legal limit</Radio>
                    <Radio value={"Scratch Card Expired"}>Scratch Card Expired</Radio>
                  </Space>
                </Radio.Group>
                <div className="form-buttons">
                  <div className="row">
                    <div className="col-md-9 offset-md-3 flex">
                      <button type="button" className="btn grey" onClick={() => setOpen(false)}>Cancel</button>
                      <button type="submit" className={clsx('btn', 'primary')} onClick={() => handleReject()} >Procced</button>
                    </div>
                  </div>
                </div>
              </Form>

            </div>
          </div>


        </div>


      </Modal>
    </div>
  )
}

const Approve = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);

  const FilterFields: FilterItem[] = useMemo(() => (
    [
      {
        name: 'createdBy',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Requested by',
        },
      },
    ]
  ), [[formRef.current]])
  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Requested By',
      dataIndex: 'userName'
    },
    {
      title: 'Profile',
      dataIndex: 'profileName'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Requested For',
      dataIndex: 'requestedFor'
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount'
    },
    {
      title: 'Count of scratch cards',
      dataIndex: 'scratchCard'
    },
    {
      title: 'Comment',
      dataIndex: 'comment'
    },
    {
      title: 'Approve/Reject',
      dataIndex: '',
      customRender(props) {
        return (
          <Actions {...props} reload={() => tableRef.current?.reload()} />
        )
      }
    },
  ]), []);
  const getData = async ({ ...values }: any) => {
    const res = await dispatch(getScratchCardList({
      ...values,
    }));
    if(res.payload?.length > 0){
      return {
        data: res.payload as any[],
      }
    } else {
      dispatch(showAlert({
        title:'No data found',
      }))
      return {
        data: [],
      }
    }

  }

  const getTotal = (values: any) => {
    return dispatch(getScratchCardListCount({...values})).then((res: any) => res.payload?.result || 0)
  }



  return (
    <TableReport
      title='Approve Scratch Card'
      // type='secondary'
      tableRef={tableRef}
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        onExport: undefined,
      }}
      getData={getData}
      getTotal={getTotal}
      pageSize={20}
    />

  )
};

export default Approve;
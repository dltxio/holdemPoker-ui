import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { useMemo, useRef } from "react";
import { ScratchCardStatus, ScratchCardStatusEnum, ScratchCardTypes, TransactionTypes, UserNameTypes } from "../models/History";
import { getScratchCardHistory, getScratchCardHistoryCount } from "../store/action";
import dayjs from "dayjs";


const CustomInnerHtml = ({ value }: any) => {
  return (
  <span dangerouslySetInnerHTML={{__html:value}}>
  </span>
  )
}

type Props = {
  defaultParams?: any,
  hideScratchCardType?: boolean
}

export enum ScratchCardTypeEnum {
  Promotions = 'PROMOTION',
  Agent = 'AFFILIATE',
  Emergency = 'EMERGENCY',
  HightRoller = 'HIGH-ROLLERS'
}

const History = (props: Props) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const FilterFields: FilterItem[] = useMemo(()=>(
    [
      {
        name: 'userName',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Username'
        }
      },
    
      {
        name: 'promoCode',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Promo Code'
        }
      },
      {
        name: 'scratchID',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Scratch ID (Last 6 digits)',
        },
        rules: [
          {len: 6, message: 'Please enter last 6 digits for scratch card.'}
        ],
      },
      {
        name: 'referenceNo',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Reference No.'
        }
      },
      {
        name: 'loginType',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Username Type',
          options: UserNameTypes,
        }
      },
      {
        name: 'type',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Scratch Card Type',
          options: ScratchCardTypes,
        }
      },
      {
        name: 'status',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Scratch Card Status',
          options: ScratchCardStatus,
        }
      },
      {
        name: 'transferType',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Transaction Type',
          options: TransactionTypes,
        }
      },
      {
        name: 'dateRange',
        type: FilterInputType.DateRange,
        inputProps: {
          options: TransactionTypes,
        }
      },
      {
        name: 'sortValue',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Sort',
          options: [
            {
              label: 'Sort by Date',
              value: 'createdAt'
            },
            {
              label: 'Sort by Amount',
              value: 'denomination'
            }
          ],
        }
      },
    ].filter((item) => {
      if (!props.hideScratchCardType && item.name === 'type') {
        return false;
      }
      return true;
    })
  ),[formRef.current])
  const columns: TableColumnType[] = useMemo(()=>(
    [
      {
        title: 'S No.',
        dataIndex: 'NO.'
      },
      {
        title: 'Requested By',
        dataIndex: 'requestedBy',
        customRender(props) {
          return (
            <CustomInnerHtml {...props} />
          )
        }
      },
      {
        title: 'Profile',
        dataIndex: 'profile'
      },
      {
        title: 'Issued By',
        dataIndex: 'issuedByName'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        customRender(props) {
          return (
            <CustomInnerHtml {...props} />
          )
        }
      },
      {
        title: 'Date,Time',
        dataIndex: 'dateAndTime'
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        customRender(props) {
          return (
            <CustomInnerHtml {...props} />
          )
        }
      },
      {
        title: 'Scratch ID',
        dataIndex: 'code'
      },
      {
        title: 'Used By & Date',
        dataIndex: 'usedByDate'
      },
      {
        title: 'Status & Expiry',
        dataIndex: 'statusExpiry',
        customRender(props) {
          return (
            <CustomInnerHtml {...props} />
          )
        }
      },
      {
        title: 'Transaction Type',
        dataIndex: 'transactionType'
      },
      {
        title: 'Comments',
        dataIndex: 'comment'
      },
      {
        title: 'Reference no.',
        dataIndex: 'generationId'
      },
    ]
  ),[])
  const getData = async (values: any) => {

    // if(!values.userName && !values.type && !values.promoCode && !values.status && !values.referenceNo && !values.transferType && !values.scratchID){
    //   dispatch(showAlert({
    //     title:'Please provide at least one input.',
    //   },'error'))
    //   return {
    //     data: [] as any[],
    //   }
    // }
    let params = initParams(values);

    const res = await dispatch(getScratchCardHistory({
      ...props.defaultParams,
      ...params,
      skip: values.skip,
      limit: values.limit
    }));
    console.log("res==== ", res);
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      "NO.": index + 1,
      "dateAndTime": dateAndTime(item.createdAt),
      "requestedBy": requestedBy(item.createdBy),
      "profile": profile(item.createdBy),
      "issuedByName": issuedByName(item.issuedBy),
      "type": type(item.scratchCardType, item.promoCode, item.affiliateId, item.playerId),
      "amount": amount(item.status, item.detailString, item.denomination, item.info),
      "usedByDate": usedByDate(item.status, item.usedBy, item.updatedAt),
      "statusExpiry": statusExpiry(item.status, item.expiresOn, item.updatedAt)
    }));
    return {
      data: dataWithNo as any[],
    }
  }

  const issuedByName = (issuedBy: any) => {
    return issuedBy?.userName;
}

  const profile = (createdBy: any) => {
    return createdBy?.role?.name;
}

  const type = (scratchCardType: any, promoCode: any, affiliateId: any, playerId: any) => {
    switch (scratchCardType) {
        case ScratchCardTypeEnum.Promotions:
            return `${scratchCardType} <br/> (${promoCode})`;
        case ScratchCardTypeEnum.Agent:
            return `AGENT <br/> (${affiliateId})`;
        case 'AGENT':
            return `AGENT <br/> (${affiliateId})`;
        case ScratchCardTypeEnum.Emergency:
            return `${scratchCardType} <br/> (${playerId})`;
        case ScratchCardTypeEnum.HightRoller:
            return `${scratchCardType} <br/> (${playerId})`;
        default:
            return 'N/A';
    }
}

  const usedByDate = (status: any, usedBy: any, updatedAt: any) => {
    if(status === ScratchCardStatusEnum.Used){
        return `${usedBy?.userName} <br/> Used On: ${dayjs(updatedAt).format('DD-MM-YYYY')}`
    }
}

  const statusExpiry = (status: any, expiresOn: any, updatedAt: any) => {
    switch(status){
        case ScratchCardStatusEnum.New:
            return `${status} <br/> Expires: ${dayjs(expiresOn).format('DD-MM-YYYY')}`;
        case ScratchCardStatusEnum.Used:
            return `${status} <br/> Used On: ${dayjs(updatedAt).format('DD-MM-YYYY')}`;
        case ScratchCardStatusEnum.Rejected:
            return `${status} <br/> Rejected: ${dayjs(updatedAt).format('DD-MM-YYYY')}`;
        case ScratchCardStatusEnum.Expired:
            return status;
    }
  }

  const requestedBy = (createdBy: any) => {
    return `${createdBy?.name} <br/> (${createdBy?.userName})`;
  }

  const amount = (status: any, detailString: any, denomination: any, info: any) => {
    if(status === ScratchCardStatusEnum.Rejected && detailString){
        return `${denomination} <br/> (${detailString})`
    }
    return `${denomination}(${info})`;
  }

  const dateAndTime = (timeString: any) => {
    return dayjs(timeString).format('DD-MMM-YYYY HH:mm:ss')
  }

  const getTotal = async (values: any) => {
    let params = initParams(values);
    return await dispatch(getScratchCardHistoryCount({...props.defaultParams, ...params})).then((res: any) => res.payload || 0);
  }

  const initParams = (values: any) =>{
    let params: any = {};

    if(values.userName !== "all" && values.userName !== ""){
        if(values?.userName?.length > 0){      
          params[values.userName + ".userName"] = values.userName;
        }
     }

    if (values.type && values.type !== "all" && values.type !== "") {
      params.scratchCardType = values.type;
    }

    if (values?.promoCode?.length > 0 && values.promoCode !== "") {
      params.promoCode = values.promoCode.toUpperCase();
    }

    if (values.status !== ScratchCardStatusEnum.All && values.status !== "") {
      params.status = values.status;
    }

    if (values.referenceNo) {
      params.generationId = values.referenceNo;
    }
    if (values.transferType) {
      params.transferType = values.transferType;
    }
    if (values.sortValue) {
      params.sortValue = values.sortValue;
    }

    if(values.scratchID){
      params.code = {'$regex': values.scratchID +"$"};
    }
    if(values?.startDate > 0 || values?.endDate > 0){
      params.createdAt = {};
      if(values?.startDate > 0){
        params.createdAt['$gte'] = values?.startDate;
      }
      if(values?.endDate > 0){
        params.createdAt['$lte'] = values?.endDate + 86400000; // added 24 hours
      }
    }
    console.log('params', params)
    return params;
  }

  return (
    <TableReport
      title='Scratch Card History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
      formProps={{
        customRenderTitle: () =>{
          return <span style={{fontWeight: 'bold', fontSize: '14px'}}>*Username type is required if using username filter.</span>
        },
      }}
    />
  )
};



export default History;
import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { FilterForm, FilterInputType } from "@/components/shared/filter/Filter";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { Fragment, useMemo, useRef, useState } from "react";
import { findPersonalDetailsPlayer } from "../../store/action";
import { PageTitle } from "@/components/shared/page-title/PageTitle";
import { CardInfo } from "@/components/shared/card-info/CardInfo";
import { useBusyContext } from "@/components/shared/busy";
import {
  faAngleDown,
  faAngleUp,
  faUpRightAndDownLeftFromCenter,
  faArrowsRotate,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import "./ProfileDetail.scss";
import dayjs from '@/core/dayjs';
import { showAlert } from "@/store/global/action";
import CustomInnerHtml from "@/components/shared/custom-inner-html/CustomInnerHtml";
const FilterFields = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    },
  },
  {
    name: 'email',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Email',
    },
  },
  {
    name: 'mobileNumber',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Mobile Number',
    },
  },
];

const Page = () => {
  const dispatch = useAppDispatch();
  const bs = useBusyContext();

  const [data, setData] = useState<any>();
  const [showing, setShowing] = useState<boolean>(true);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const filterFormRef = useRef<FormInstance>(null);
  const cardList = useMemo(() => ([
    {
      label: "Personal Info",
      data: [
        {
          label: "User Name",
          value: "userName",
        },
        {
          label: "Created On",
          value: "createdAtFormated",
        },
        {
          label: "First Name",
          value: "firstName",
        },
        {
          label: "Last Name",
          value: "lastName",
        },
        {
          label: "Gender",
          value: "gender",
        },
        {
          label: "Date of Birth",
          value: "dateOfBirthFormated",
        },
        {
          label: "Email Id",
          value: "emailId",
        },
        {
          label: "Mobile No",
          value: "mobileNo",
          customRender: (props: any) => {
            return (
              <CustomInnerHtml {...props} />
            )
          }
        },
        {
          label: "Last Played",
          value: "lastPlayed",
        },
      ],
    },
    {
      label: "Address",
      data: [
        {
          label: "Addres 1",
          value: "address1",
        },
        {
          label: "Addres 2",
          value: "address2",
        },
        {
          label: "City",
          value: "city",
        },
        {
          label: "State",
          value: "state",
        },
        {
          label: "Post Code",
          value: "pincode",
        },

      ],
    },
    {
      label: "Player Parent Details",
      data: [
        {
          label: "Parent user name",
          value: "isParentUserName",
        },
        {
          label: "Parent Type",
          value: "parentType",
        },
        {
          label: "Parent Mobile",
          value: "affiliateMobile",
        },
        {
          label: "Parent Email",
          value: "affiliateEmail",
        },
      ],
    },
    {
      label: "Bank Details",
      data: [
        {
          label: "Name on Account",
          value: "WithdrawAcName",
        },
        {
          label: "Account Type",
          value: "WithdrawAcType",
        },
        {
          label: "Account No",
          value: "WithdrawAcNumber",
        },
        {
          label: "IFSC Code",
          value: "WithdrawAcIfsc",
        },
        {
          label: "Bank Name",
          value: "WithdrawAcBank",
        },
        {
          label: "Branch",
          value: "WithdrawAcBranch",
        },
        {
          label: "Pan Card",
          value: "decryptedPanNumber",
        },
      ],
    },
    {
      label: "Game Account Info",
      data: [
        {
          label: "Total Available Chips",
          value: "totalChips",
        },
        {
          label: "Withdrawable Chips",
          value: "realChips",
        },
        {
          label: "Instant Bonus",
          value: "instantBonusAmount",
        },
        {
          label: "Locked Bonus",
          value: "unclaimedBonusAmount",
        },
        {
          label: "Unlocked Bonus",
          value: "claimedBonusAmount",
        },
        {
          label: "Current VIP Points",
          value: "megaPoints",
        },
        {
          label: "Total Play Chips",
          value: "freeChips",
        },
        {
          label: "Total Leaderboard Winnings",
          value: "totalLeaderboardWinnings",
        },
      ],
    },
  ]), [])
  const handleShowing = () => {
    setShowing(!showing);
  }

  const handleIsFull = () => {
    setIsFull(!isFull);
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    setData({});
    setIsReset(false);
  };


  const handleFilterSubmit = (values: any) => {
    // if (!values?.userName && !values.email && !values.mobileNumber) {
    //   dispatch(showAlert({ content: 'Please provide at least one filter', title: 'Error!' }))
    //   return;
    // }
    setIsReset(true);
    getData(values);
  };
  const getData = async (values: any) => {
    bs.showBusy();
    try {
      const res: any = await dispatch(
        findPersonalDetailsPlayer({
          ...values,
        })
      );
      if (JSON.stringify(res?.payload?.result) === "{}") {
        dispatch(showAlert({ title: "error", content: "Please enter valid player details" }));
      } else {
        setData(res.payload.result);
        return res.payload.result[0];
      }
      return {};
    } finally {
      bs.hideBusy();
    }
  }
  return (
    <Fragment>
      <div className='personal-detail-content'>
        <PageTitle text="Personal Details" />
        <Breadcrumb />

        <div className={`table-report-content__wrapper default`}>
          {FilterFields && FilterFields.length > 0 && <div className='table-report-content__filter'>
            <FilterForm
              ref={filterFormRef}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset} items={FilterFields} />
          </div>}
        </div>
        {isReset && (
          <>
            {data && <div
              className={clsx(
                'personal-info-content',
                'secondary',
                { full: isFull },
              )}
            >
              <div className="personal-info-content__header">
                <div className="personal-info-content__header__left">
                  <i className={clsx('bi', 'bi-person')}></i>
                  <span>Player Details</span>
                </div>

                <div className="personal-info-content__header__right">
                  {!isFull && (<FontAwesomeIcon className="expand" onClick={handleShowing} icon={showing ? faAngleDown : faAngleUp} />)}
                  <FontAwesomeIcon onClick={handleIsFull} icon={faUpRightAndDownLeftFromCenter} />
                </div>
              </div>

              <div className={clsx('personal-info-content__body', { hidden: !showing })}>
                {cardList.map((card, idx) => (
                  <div key={`card-${idx}`} className="row">
                    <CardInfo
                      icon="bi-person"
                      title={card.label}
                      type="info"
                      data={card.data.map((item) => ({
                        ...item,
                        value: (data && (data as any)[`${item.value}`]) ,
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>}
          </>
        ) }




      </div>
    </Fragment>
  )
};

export default Page;
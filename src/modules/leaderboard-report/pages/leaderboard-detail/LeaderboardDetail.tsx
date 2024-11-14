import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading } from "@/components/shared/heading/Heading";
import "./LeaderboardDetail.scss"
import clsx from "clsx";
import { listLeaderboardReport } from "../../store/action";
import { LeaderboardTypesEnum } from "@/modules/leaderboard/models/Leaderboard";
import { CustomBreadcrumb } from "@/components/shared/customBreadcrumb/CustomBreadcrumb";

const Page = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    const fetchData = async (id: string) => {
        try {
            const params = {
                id
            }
            const res = await dispatch(listLeaderboardReport(params));
            setData(res.payload[0]);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);
    return (
        <Fragment>
            <div className='leaderboard-detail'>
                {/* <Breadcrumb /> */}
                <CustomBreadcrumb  modules={['Leaderboard Reports','Detailed Leaderboard Report']}/>
                {
                    data && <div className="leaderboard-detail__container">
                        <div className="portlet-title">
                            <div className="portlet-title__caption">
                                <i className={clsx('bi', 'fs-3 bi-award', 'font-green')}></i>
                                <span className="caption-subject font-green sbold uppercase">Detailed Leaderboard Report</span>
                            </div>
                            <div className="portlet-title__content">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Leaderboard Name</span>
                                            <span className="item__value">{data?.leaderboardName}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Start Date</span>
                                            <span className="item__value">{data?.startTimeDisplay}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">End Date</span>
                                            <span className="item__value">{data?.endTimeDisplay}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Leaderboard Type</span>
                                            <span className="item__value">{data?.leaderboardTypeDisPlay}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Total Prize Pool</span>
                                            <span className="item__value">{data?.totalPrizePool}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">No. of Winners</span>
                                            <span className="item__value">{data?.noOfWinners}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Min Leaderboard Points</span>
                                            <span className="item__value">{data?.minVipPoints}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="item">
                                            <span className="item__title">Min Hands</span>
                                            <span className="item__value">{data?.minHands}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="item-tables">
                                            <span className="item__title">Selected Tables</span>
                                            <p className="item__value" dangerouslySetInnerHTML={{ __html: data?.table }}></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="portlet-title__table">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                S.No.
                                            </th>
                                            <th scope="col">
                                                Username
                                            </th>
                                            <th scope="col">
                                                Email
                                            </th>
                                            <th scope="col">
                                                Mobile
                                            </th>
                                            {
                                                (data?.leaderboardType === LeaderboardTypesEnum.closedVip || data?.leaderboardType === LeaderboardTypesEnum.openVip) && <th scope="col">
                                                    Leaderboard Points
                                                </th>
                                            }

                                            <th scope="col">
                                                Hands Played
                                            </th>
                                            {
                                                (data?.leaderboardType === LeaderboardTypesEnum.openHand || data?.leaderboardType === LeaderboardTypesEnum.closedHand) &&
                                                <Fragment>
                                                    <th scope="col">
                                                        HeadsUP Hands Played
                                                    </th>
                                                    <th scope="col">
                                                        Total Hands Played
                                                    </th>
                                                </Fragment>
                                            }
                                            <th scope="col">
                                                Rank
                                            </th>
                                            <th scope="col">
                                                Prize Money
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.participantsArray?.map((item: any, index: number) => (
                                                <tr className="body-row" key={item._id.pId}>
                                                    <td>{index+1}</td>
                                                    <td>{item?._id.userName}</td>
                                                    <td>{item?.email}</td>
                                                    <td>{item?.mobile}</td>
                                                    {
                                                        (data?.leaderboardType === LeaderboardTypesEnum.closedVip || data?.leaderboardType === LeaderboardTypesEnum.openVip)
                                                        && <Fragment>
                                                            <td>{item?.total.toFixed(4) || 'N/A'}</td>
                                                            <td>{item?.myCount}</td>
                                                        </Fragment>

                                                    }
                                                    {
                                                        (data?.leaderboardType === LeaderboardTypesEnum.openHand || data?.leaderboardType === LeaderboardTypesEnum.closedHand) &&
                                                        <Fragment>
                                                            <td>{item?.total || 'N/A'}</td>
                                                            <td>{item?.headsUP || 'N/A'}</td>
                                                            <td>{item?.myCount || 'N/A'}</td>
                                                        </Fragment>
                                                    }
                                                    <td>{item?.rank || 'N/A'}</td>
                                                    <td>{(item?.amountWon || item?.amountWon === 0) ? item.amountWon : 'N/A'}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Fragment >
    )
};

export default Page;
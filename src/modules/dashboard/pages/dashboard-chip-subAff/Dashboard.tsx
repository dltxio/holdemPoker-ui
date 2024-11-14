import React, { useState, useEffect } from 'react'
import "./Dashboard.scss"
import { useAppDispatch } from '@/store/hooks'
import { listOneAffiliate, listAgentPlayerChips } from '../../store/action'
import { Card } from '@/components/shared/card/Card';
import '@/modules/account/pages/account-detail/AccountDetail.scss';

const DashboardChip = () => {
    const [result, setResult] = useState<any>();
    const [agenPlayerChip, setAgenPlayerChip] = useState<any>();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        getData();
        getAgenPlayerChip();
    }, [])
    
    const getData = async () => {
        const res = await dispatch(listOneAffiliate({}))
        let resultData: any = {}
        if (res.payload.data.length > 0) {
            const bonusOrRealChips = parseFloat(res.payload.data[0].realChips);
            const deposit = parseFloat(res.payload.data[0].chipsManagement.deposit);
            const profit = parseFloat(res.payload.data[0].profit);
            const withdrawal = parseFloat(res.payload.data[0].withdrawal);
            const rakeCommision = parseFloat(res.payload.data[0].rakeCommision);
            
            resultData.bonusOrRealChips = isNaN(bonusOrRealChips) ? 0 : String(bonusOrRealChips).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            resultData.deposit = String(deposit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            resultData.profit = String(profit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            resultData.withdrawal = String(withdrawal).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            resultData.rakeCommision = String(rakeCommision).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
        }
        setResult(resultData)
    }

    const getAgenPlayerChip = async () => {
        const res = await dispatch(listAgentPlayerChips({}))
        let responseData: any = {}
        if (res.payload.data.length > 0) {
            // const playerRealChips = res.payload.data[0].totalReal.toFixed(3);
            // const playerRealChips = res.payload.data[0].totalReal;
            // responseData.playerRealChips = String(playerRealChips).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1.").split("").reverse().join("");
            responseData.playerRealChips = res.payload.data[0].totalReal;
            responseData.playerInstantChips = res.payload.data[0].totalInstant;
        } else {
            responseData.playerRealChips = 0;
            responseData.playerInstantChips = 0;
        }
        setAgenPlayerChip(responseData)
    }
    
    return (
        // <div className='dashboard'>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat blue">
        //             <div className="details">
        //                 <div className="number" > {result?.bonusOrRealChips || 0} </div>
        //                 <div className="desc"> Total Chips Available </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat red">
        //             <div className="details">
        //                 <div className="number"> {result?.deposit || 0} </div>
        //                 <div className="desc"> Total Added Chips </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat green">
        //             <div className="details">
        //                 <div className="number"> {result?.profit || 0} </div>
        //                 <div className="desc"> Profit </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" >
        //         <div className="dashboard-stat purple">
        //             <div className="details">
        //                 <div className="number"> {result?.withdrawal} </div>
        //                 <div className="desc"> Total Chips Pulled from Players </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat green">
        //             <div className="details">
        //                 <div className="number"> {result?.rakeCommision} </div>
        //                 <div className="desc"> Commission (%) </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat red">
        //             <div className="details">
        //                 <div className="number"> { agenPlayerChip?.playerRealChips.toLocaleString('en-US') || "0.00" } </div>
        //                 <div className="desc"> Total Player Real Chips </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
        //         <div className="dashboard-stat purple">
        //             <div className="details">
        //                 <div className="number"> { agenPlayerChip?.playerInstantChips.toLocaleString('en-US') || "0.00" } </div>
        //                 <div className="desc"> Total Player Instant Chips </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="ccount-detail-content__static">
            <div className="row">
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={result?.bonusOrRealChips || 0}
                        detail={'Total Chips Available'}
                        type={'primary'}
                        icon={'bi-chat'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={result?.deposit || 0}
                        detail={'Total Added Chips'}
                        type={'danger'}
                        icon={'bi-bar-chart-fill'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={result?.profit || 0}
                        detail={'Profit'}
                        type={'info'}
                        icon={'bi-cart'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={result?.withdrawal || 0}
                        detail={'Total Chips Pulled from Players'}
                        type={'secondary'}
                        icon={'bi-globe'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={result?.rakeCommision || 0}
                        detail={'Commission (%)'}
                        type={'info'}
                        icon={'bi-globe'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={agenPlayerChip?.playerRealChips.toLocaleString('en-US') || "0.00"}
                        detail={'Total Player Real Chips'}
                        type={'danger'}
                        icon={'bi-globe'}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Card
                        title={agenPlayerChip?.playerInstantChips.toLocaleString('en-US') || "0.00"}
                        detail={'Total Player Instant Chips'}
                        type={'secondary'}
                        icon={'bi-globe'}
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardChip
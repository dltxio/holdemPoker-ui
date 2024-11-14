import React, { Fragment, useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

// Components
import { PageTitle } from "@/components/shared/page-title/PageTitle";
import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { Button } from "@/components/shared/button/Button";
import { Ribbon, RibbonProps } from "@/components/shared/ribbon/Ribbon";
import { CardInfo } from "@/components/shared/card-info/CardInfo";
import { getCurrentDataOfBalanceSheetForDashboard, getAccount } from "@/modules/account/store/action";

// Actions
import { showAlert } from "@/store/global/action";

import "./BalanceSheet.scss";
import { BalanceSheetForDashboard } from "../../models/BalanceSheetForDashboard";
import DatePicker from "@/components/antd/DatePicker";
import { useBusyContext } from "@/components/shared/busy";
import DisplayNumber from "@/components/shared/DisplayNumber";
import { saveAsPdf } from "@/helpers/pdf";

const cards = [
	{
		label: "Admin Details",
		data: [
			{
				label: "Fund Transfer Player",
				value: "totalTranferToPlayerByAdmin",
			},
			{
				label: "Fund Transfer Agent",
				value: "totalFundTranferredToAgent",
			},
			{
				label: "Online Chips Added",
				value: "totalOnlineChipsAdded",
			},
			{
				label: "Cashout Player Success",
				value: "totalPlayerCashoutSuccessToAdmin",
			},
			{
				label: "Cashout Player Pending",
				value: "totalPlayerCashoutAmtPending",
			},
			{
				label: "Rake Generated Admin",
				value: "totalRakeGeneratedByAdmin",
			},
			{
				label: "Rake Cashout Success Aff",
				value: "totalAffCashoutSuccessToAdmin",
			},
			{
				label: "Rake Cashout Pending Aff",
				value: "totalAffCashoutRakeAmtPending",
			},
			{
				label: "Rake Cashout Success subaff",
				value: "totalSubAffCashoutSuccessToAdmin",
			},
			{
				label: "Rake Cashout Pending subaff",
				value: "totalSubaffCashoutRakeAmtPending",
			},
			{
				label: "Rake Cashout Success Agent",
				value: "totalAgentCashoutRakeSuccessToAdmin",
			},
			{
				label: "Rake Cashout Pending agent",
				value: "totalAgentCashoutRakeAmtPending",
			},
			{
				label: "Chips Cashout Success Agent",
				value: "totalAgentCashoutRealSuccessToAdmin",
			},
			{
				label: "Chips Cashout Pending agent",
				value: "totalAgentCashoutRealAmtPending",
			},
		],
	},
	{
		label: "Agent Details",
		data: [
			{
				label: "Total Available Chips",
				value: "agentChipsAvailabe",
			},
      {
				label: "Rake Generated",
				value: "totalRakeGeneratedByAgent",
			},
			{
				label: "Available Rake",
				value: "totalAgentAvailableRake",
			},
      {
				label: "Pending Rake Cashout Sub-agent",
				value: "subAgentPendingRakeCashoutToAgent",
			},
			{
				label: "Pending Cashout Player",
				value: "playerPendingCashoutToAgent",
			},
      {
				label: "Success Rake Cashout Sub-agent",
				value: "totalSubAgentRakeCashoutSucess",
			},
      {
				label: "Success Cashout Player",
				value: "totalPlayerSucessCashoutsToAgent",
			},
      {
				label: "Fund Transfer Player",
				value: "totalTranferToPlayerByAgent",
			},
			{
				label: "Fund Transfer SubAgent",
				value: "totalTransferToSubAgentByAgent",
			},
      {
				label: "Pending Chips Cashout Sub-agent",
				value: "subAgentPendingRealCashoutToAgent",
			},
			{
				label: "Success Cashout SubAgent",
				value: "totalSubAgentRealCashoutSucess",
			},
		],
	},
	{
		label: "Sub Agent Details",
		data: [
			{
				label: "Total Available Chips",
				value: "subAgentChipsAvailable",
			},
      {
				label: "Rake Generated",
				value: "totalRakeGeneratedBySubagent",
			},
			{
				label: "Available Rake",
				value: "totalRakeAvailablesSubAgent",
			},
      {
				label: "Fund Transfer Player",
				value: "totalTranferToPlayerBySubagent",
			},
			{
				label: "Player Pending Cashout",
				value: "playerPendingCashoutToSubAgent",
			},
			{
				label: "Cashout Success Player",
				value: "totalPlayerSucessCashoutsToSubagent",
			},
		],
	},
	{
		label: "Affiliate Details",
		data: [
			{
				label: "Rake Generated",
				value: "totalRakeGeneratedByAffiliate",
			},
			{
				label: "Rake Available",
				value: "totalRakeAvailableAffiliate",
			},
		],
	},
	{
		label: "Sub Affiliate Details",
		data: [
			{
				label: "Rake Generated",
				value: "totalRakeGeneratedBySubaff",
			},
			{
				label: "Rake Available",
				value: "totalRakeAvailableSubAffiliate",
			},
		],
	},
	{
		label: "Player Details",
		data: [
			{
				label: "Player Chips Real",
				value: "totalPlayerChipsReal",
			},
			{
				label: "Player Actual Chips Real",
				value: "totalPlayerRealChipsAvailable",
			},
			{
				label: "Total Player Chips on Table",
				value: "playerTotalChipsOnTable",
			},
			{
				label: "Rake Generated",
				value: "totalRakeGeneratedByPlayers",
			},
			{
				label: "Rakeback Released",
				value: "playerTotalRakebackReleased",
			},
			{
				label: "Player Chips Instant",
				value: "totalPlayerInstantChipsAvailable",
			},
			{
				label: "Player Instant Chips on Table",
				value: "playerTotalInstantChipsOnTable",
			},
			{
				label: "Total Amount(pot+bet) on Table",
				value: "totalAmountPotBetOnTable",
			},
			{
				label: "Total Rakeback",
				value: "totalPlayerRakeBack",
			},
		],
	},
];

// const RibbonBalanceSheet = (
// 	props: RibbonProps & {
// 		content: any;
// 	}
// ) => (
// 	<Ribbon {...props} content={<DisplayNumber value={props.content || 0} />} />
// );

const Page = () => {
	const dispatch = useAppDispatch();
	const bs = useBusyContext();
	const [date, setDate] = useState<any>(null);
	const [data, setData] = useState<BalanceSheetForDashboard>();
	const [dataGuaranteed, setDataGuaranteed] = useState<any>(null);
	const [dataNonGuaranteed, setDataNonGuaranteed] = useState<any>(null);
	const [dataSitNGo, setDataSitNGo] = useState<any>(null);
	const [isExportPdf, setIsExportPdf] = useState<Boolean>(false);

	const RibbonBalanceSheet = (
		props: RibbonProps & {
			content: any;
		}
	) => (
		<Ribbon {...props} content={<DisplayNumber value={props.content || 0} />} />
	);

	const load = async (date?: number) => {
		bs.showBusy();
		try {
			const res: any = await dispatch(
				getCurrentDataOfBalanceSheetForDashboard({
					date,
				})
			);
			// if (res.payload) {
			// 	// const requestAccountResult: any = await dispatch(getAccount());
			// 	// const dataAccount = requestAccountResult.payload.data;
			// 	// // guaranteed 
			// 	// let guaranteed: any = {};
			// 	// guaranteed.totalReentryFees = dataAccount.normalGauranteed.registrationEntryFees + dataAccount.normalGauranteed.totalReentryFees + dataAccount.freeRoll.totalReentryFees;
			// 	// guaranteed.totalReentryHouseFees = dataAccount.normalGauranteed.registrationHouseFees + dataAccount.normalGauranteed.totalReentryHouseFees + dataAccount.freeRoll.totalReentryHouseFees;
			// 	// guaranteed.winnings = dataAccount.normalGauranteed.winnings + dataAccount.freeRoll.winnings;
			// 	// setDataGuaranteed(guaranteed);

			// 	// // non guaranteed
			// 	// let nonGuaranteed: any = {};
			// 	// nonGuaranteed.totalReentryFeesNon = dataAccount.normalNonGauranteed.registrationEntryFees + dataAccount.normalNonGauranteed.totalReentryFees;
			// 	// nonGuaranteed.totalReentryHouseFeesNon = dataAccount.normalNonGauranteed.registrationHouseFees + dataAccount.normalNonGauranteed.totalReentryHouseFees;
			// 	// nonGuaranteed.winningsNon = dataAccount.normalNonGauranteed.winnings;
			// 	// setDataNonGuaranteed(nonGuaranteed);

			// 	// // sit n go
			// 	// let sitNGo: any = {}
			// 	// sitNGo.totalEntryFeesSitNGo = dataAccount.sitNGo.totalEntryFees;
			// 	// sitNGo.totalHouseFeesSitNGo = dataAccount.sitNGo.totalEntryHouseFees;
			// 	// sitNGo.winningsSitNGo = dataAccount.sitNGo.winnings;
			// 	// setDataSitNGo(sitNGo);
			// 	// res.payload = res.payload || {};
			// 	// res.payload.normalGauranteedWinnings = guaranteed.winnings;
			// 	// res.payload.totalReentryFees = guaranteed.totalReentryFees;
			// 	// res.payload.totalReentryHouseFees = guaranteed.totalReentryHouseFees;
			// 	// res.payload.totalReentryHouseFeesNon = nonGuaranteed.totalReentryHouseFeesNon;
			// 	// res.payload.totalHouseFeesSitNGo = sitNGo.totalHouseFeesSitNGo;
			// }
			
			console.log("res.payload: ", res.payload);
			setData(res.payload || {});
			return res.payload;
		} finally {
			bs.hideBusy();
		}
	};

	useEffect(() => {
		load();
	}, []);

	const convertToCSV = (data: any) => {
		const header = Object.keys(data[0]).join(',');
		console.log("header: ", header);
		const csv = data.map((row: any) => Object.values(row).join(',')).join('\n');
		return header + '\n' + csv;
	}

	const exportToCSV = (data: any, fileName: string) => {
		console.log("fileName: ", fileName);
		console.log("data: ", data);
		const csv = convertToCSV(data);
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('href', url);
		a.setAttribute('download', fileName);
		a.click();
	}

	const handleOnChange = (date: any, dateString: string) => {
		load(date.utc().startOf("day").valueOf());
		setDate(date);
	};

	const handleOnSearch = async () => {
		const res = await load(date?.utc().startOf("day").valueOf());
		if (!res) {
			dispatch(
				showAlert({
					title: "Info",
					content: "A Request Already Generated! Please Wait",
				})
			);
		}
	};

	// const handleOnExportCSV = async () => {
	// 	let dataToExport: any = [];
	// 	dataToExport.push({
	// 		"NET BALANCE": data?.netBalance?.toString(),
	// 		"TOTAL CHIPS GIVEN": data?.totalChipsGiven?.toString(),
	// 		"TOTAL AVAILABLE CHIPS": data?.totalAvailableChips?.toString(),
	// 		"AVAILABLE CHIPS INSTANT": data?.totalInstantAvailable?.toString(),
	// 		"TOTAL RAKE LIABILITY": data?.totalRakeLiability?.toString(),
	// 		"TOTAL CASHOUT PLAYER": data?.totalCashoutPlayer?.toString(),
	// 		"TOTAL ADMIN RAKE": data?.totalAdminRake?.toString(),
	// 		"TOTAL CASHOUT RAKE (AFF)": data?.totalCashoutRakeAff?.toString(),
	// 		"AGENT CASHOUT RAKE": data?.totalAgentCashoutRake?.toString(),
	// 		"SUBAGENT CASHOUT RAKE": data?.totalSubAgentCashoutRake?.toString(),
	// 		"TOTAL CASHOUT CHIPS AGENT": data?.totalCashoutChipsAgent?.toString(),
	// 		"CASHOUT CHIPS SUBAGENT": data?.totalCashoutChipsSubAgent?.toString(),
	// 		"INSTANT CHIPS PULLED": data?.instantChipsPulled?.toString(),
	// 		"LEADERBOARD WINNINGS": data?.leaderboardWinning?.toString(),
	// 		"LOCKED BONUS RELEASED": data?.lockedBonusReleased?.toString(),
	// 		"PROMOTIONAL CHIPS": data?.totalPromotionalChips?.toString(),
	// 		"SCRATCH CARD USED": data?.totalPlayerScratchCardAmount?.toString(),

	// 	});

	// 	console.log("dataToExport: ", dataToExport);

	// 	if (dataToExport.length > 0) {
	// 		exportToCSV(dataToExport, 'balancesheet.csv');
	// 	} else {
	// 		console.log('Không có dữ liệu để xuất ra CSV');
	// 	}
	// }

	const handleOnExportCSV = async () => {
		const savePdfElement = document.getElementById("save-pdf");
	  
		if (!savePdfElement) {
		  console.log('Không có dữ liệu để xuất ra CSV từ "save-pdf"');
		  return;
		}
	  
		const dataToExport = [];
		
		const savePdfData = savePdfElement.textContent;
		
		if (savePdfData) {
		  dataToExport.push({ savePdfData });
		}
	  
		if (dataToExport.length > 0) {
		  exportToCSV(dataToExport, 'balancesheet.csv');
		} else {
		  console.log('Không có dữ liệu để xuất ra CSV');
		}
	}

	const handleReset = () => {
		setDate(null);
		load();
	};

	const handleOnExportPdf = async () => {
		bs.showBusy();
		try {
			setIsExportPdf(true);
			const el = document.getElementById("save-pdf");
			if (el) {
				await saveAsPdf(el, "balancesheet.pdf");
				// setIsExportPdf(false);
			}
		} finally {
			bs.hideBusy();
		}
	};

  const handleRefresh = () => {
    load();
  }

	return (
		<Fragment>
			<div className="balance-sheet-content">
				<PageTitle text="Balance Sheet" />

				<Breadcrumb />

				<div className="balance-sheet-content__actions">
					<div className="balance-sheet-content__actions__datetime">
						<DatePicker
							className="default"
							placeholder="Select date"
							value={date}
							onChange={handleOnChange}
							suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
							allowClear={false}
						/>
					</div>

					<div className="balance-sheet-content__actions__btns">
						<Button
							text="Search"
							type="info"
							rounded={true}
							onClick={handleOnSearch}
							icon="bi-pencil-square"
							solid={true}
						/>

						<Button
							text="Reset"
							type="info"
							htmlType="button"
							rounded={true}
							onClick={handleReset}
							icon="bi-pencil-square"
							solid={true}
						/>

						<Button
							text="Export to CSV"
							type="info"
							htmlType="button"
							rounded={true}
							onClick={handleOnExportCSV}
							icon="bi-download"
							solid={true}
						/>

						<Button
							text="Export to PDF"
							type="info"
							rounded={true}
							onClick={handleOnExportPdf}
							icon="bi-download"
							solid={true}
						/>
					</div>
				</div>
				<div id="save-pdf">
					<div className="row">
						<div className="col-md-12">
							<RibbonBalanceSheet
								type="info"
								title="NET BALANCE"
								content={data?.netBalance ? data?.netBalance?.toString() : 0}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL CHIPS GIVEN"
								content={data?.totalChipsGiven ? data?.totalChipsGiven?.toString() : 0}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="primary"
								title="TOTAL AVAILABLE CHIPS"
								content={data?.totalAvailableChips?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="warning"
								title="AVAILABLE CHIPS INSTANT"
								content={data?.totalInstantAvailable?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL RAKE LIABILITY"
								content={data?.totalRakeLiability?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="primary"
								title="TOTAL CASHOUT PLAYER"
								content={data?.totalCashoutPlayer?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="warning"
								title="RAKE TO ADMIN"
								content={data?.rakeToAdmin?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="RAKE FROM 1ST LINE"
								content={data?.rakeFrom1stLine?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="RAKE FROM 2ND LINE"
								content={data?.rakeFrom2ndLine?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="RAKE TO ADMIN (reconcile)"
								content={data?.rakeToAdminReconcile?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL CASHOUT RAKE (AFF)"
								content={data?.totalCashoutRakeAff?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="AGENT CASHOUT RAKE"
								content={data?.totalAgentCashoutRake?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="primary"
								title="SUBAGENT CASHOUT RAKE"
								content={data?.totalSubAgentCashoutRake?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="warning"
								title="TOTAL CASHOUT CHIPS AGENT"
								content={data?.totalCashoutChipsAgent?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="CASHOUT CHIPS SUBAGENT"
								content={data?.totalCashoutChipsSubAgent?.toString()}
							/>
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="primary"
								title="INSTANT CHIPS PULLED"
								content={data?.instantChipsPulled?.toString()}
							/>
						</div>
					</div>
					<div className="dotLine" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
						<span style={{ border: "1px solid #000", width: "auto", height: "4px" }}></span>
						<div className="row">
							<div className="col-lg-3 col-md-4">
								<RibbonBalanceSheet
									type="info"
									title="LEADERBOARD WINNINGS"
									content={data?.leaderboardWinning?.toString()}
								/>
							</div>

							<div className="col-lg-3 col-md-4">
								<RibbonBalanceSheet
									type="primary"
									title="LOCKED BONUS RELEASED"
									content={data?.lockedBonusReleased?.toString()}
								/>
							</div>

							<div className="col-lg-3 col-md-4">
								<RibbonBalanceSheet
									type="warning"
									title="PROMOTIONAL CHIPS"
									content={data?.totalPromotionalChips?.toString()}
								/>
							</div>

							<div className="col-lg-3 col-md-4">
								<RibbonBalanceSheet
									type="info"
									title="SCRATCH CARD USED"
									content={data?.totalPlayerScratchCardAmount?.toString()}
								/>
							</div>
						</div>
					</div>
					{/* <div className="guaranteed row">
						<div className="line" style={{ borderLeft: "5px solid #8bb4e7" }}>
							<PageTitle text="Guaranteed" />
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL ENTRY FEES"
								content={dataGuaranteed?.totalReentryFees?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL HOUSE FEE"
								content={dataGuaranteed?.totalReentryHouseFees?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL TOURNAMENT WINNINGS"
								content={dataGuaranteed?.winnings?.toString() || 0}
							/>
						</div>
					</div>
					<div className="non-guaranteed row">
						<div className="line" style={{ borderLeft: "5px solid #8bb4e7" }}>
							<PageTitle text="Non-Guaranteed" />
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL ENTRY FEES"
								content={dataNonGuaranteed?.totalReentryFeesNon?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL HOUSE FEE"
								content={dataNonGuaranteed?.totalReentryHouseFeesNon?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL TOURNAMENT WINNINGS"
								content={dataNonGuaranteed?.winningsNon?.toString() || 0}
							/>
						</div>
					</div>
					<div className="sitngo row">
						<div className="line" style={{ borderLeft: "5px solid #8bb4e7" }}>
							<PageTitle text="Sit N Go" />
						</div>

						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL ENTRY FEES"
								content={dataSitNGo?.totalEntryFeesSitNGo?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL HOUSE FEE"
								content={dataSitNGo?.totalHouseFeesSitNGo?.toString() || 0}
							/>
						</div>
						<div className="col-lg-3 col-md-4">
							<RibbonBalanceSheet
								type="info"
								title="TOTAL WINNINGS"
								content={dataSitNGo?.winningsSitNGo?.toString() || 0}
							/>
						</div>
					</div> */}
				</div>
				{cards.map((card, idx) => (
					<div key={`card-${idx}`} className="row">
						<CardInfo
							icon="bi-person"
							title={card.label}
							type={idx % 2 === 0 ? "info" : "danger"}
							data={card.data.map((item) => ({
								label: item.label,
								value: (data && (data as any)[`${item.value}`]) || 0,
							}))}
              onRefresh={handleRefresh}
						/>
					</div>
				))}
			</div>
		</Fragment>
	);
};

export default Page;

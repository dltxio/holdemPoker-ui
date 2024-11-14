import React, { Fragment, useState } from 'react';
import { Note } from '@/components/shared/note/Note';
import { getCurrentUserData } from "@/helpers/common";
import DashboardChip from './dashboard-chip/DashboardChip';
import DashboardChipAff from "./dashboard-chip-subAff/Dashboard";
import DashboardChipNewSup from './dashboard-chip-newSubAff/Dashboard';
import { Button } from '@/components/shared/button/Button';
const Dashboard = () => {
  const currentUser = getCurrentUserData();
  console.log("currentUser: ", currentUser);
  console.log("currentUser: ", currentUser.department);
  console.log("currentUser.department ===", currentUser.department === "newsubAffiliate");
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://texashodl.net/?v=${currentUser.userName}`);
    alert("Link copied.")
  }
  return (
    <Fragment>
      <Note content={'Welcome to Poker Dashboard!'} />
      {currentUser.department === "affiliate" && (
        <>
          <DashboardChip />
        </>
      )}
      {currentUser.department === "subAffiliate" && (
        <>
          <DashboardChipAff />
        </>
      )}
      {(currentUser.department === "newsubAffiliate" || currentUser.department === "newaffiliate") && (
        <>
          <DashboardChipNewSup />
        </>
      )}
      {currentUser.department !== "admin" && (
        <>
          <div className='dashboard-ref-link'>Ref Link: {`https://texashodl.net/?v=${currentUser.userName}`} <Button
            text="Copy Link"
            type="secondary"
            rounded={true}
            onClick={handleCopyLink}
            icon="bi-pencil-square"
          /></div>
        </>
      )}
    </Fragment>
  )
};

export default Dashboard;
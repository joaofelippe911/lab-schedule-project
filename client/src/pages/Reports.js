import { useState } from "react";
import GenerealReportTable from "../components/GeneralReportTable";
import GreetersReportTable from "../components/GreetersReportTable";
import ReportNavbar from "../components/ReportNavbar";
import TecniciansReportTable from "../components/TecniciansReportTable";

export default function Reports() {
  const [reportsData, setReportsData] = useState({});

  return (
    <div id="reports-page">
      <ReportNavbar onDateIntervalChange={setReportsData} />
      <GenerealReportTable data={reportsData} />
      <TecniciansReportTable data={reportsData} />
      <GreetersReportTable data={reportsData} />
    </div>
  );
}

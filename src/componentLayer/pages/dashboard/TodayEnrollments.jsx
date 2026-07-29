import React, { useState, useEffect } from "react";
import { Offcanvas } from "bootstrap";
import { toast } from "react-toastify";
import { MdFilterList } from "react-icons/md";
import Button from "../../components/button/Button";
import {
  getCouncellersListInTotalEnrollments,
  getStudentsListInTotalEnrollments,
  getTotalEnrollmentDeatils,
  getTodayDate,
} from "../newDashboard/utils/DataUtilities";
import TodayEnrollmentsBranchTable from "./TodayEnrollments/TodayEnrollmentsBranchTable";
import TodayEnrollmentsCounsellorTable from "./TodayEnrollments/TodayEnrollmentsCounsellorTable";
import TodayEnrollmentsStudentTable from "./TodayEnrollments/TodayEnrollmentsStudentTable";

const TodayEnrollments = ({ data, userData }) => {
  const today = getTodayDate();

  const [filterDates, setFilterDates] = useState({
    fromDate: today,
    toDate: today,
  });

  const [branchData, setBranchData] = useState([]);
  const [counsellorData, setCounsellorData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const [activeBranch, setActiveBranch] = useState(null);
  const [activeCounsellor, setActiveCounsellor] = useState(null);

  const [loadingStates, setLoadingStates] = useState({
    branchLoading: false,
    councellerLoading: false,
    studentLoading: false,
  });

  // ================= API =================
  const fetchBranchData = async (fromDate, toDate) => {
    setLoadingStates(prev => ({ ...prev, branchLoading: true }));
    try {
      const res = await getTotalEnrollmentDeatils({ fromDate, toDate });
      setBranchData(res?.data?.branches || []);
      // Also set counsellors from the same API (topEnquiryTakenBy)
      setCounsellorData(res?.data?.topEnquiryTakenBy || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load branch data");
    } finally {
      setLoadingStates(prev => ({ ...prev, branchLoading: false }));
    }
  };

  const fetchCounsellors = async (branchId, fromDate, toDate) => {
    setLoadingStates(prev => ({ ...prev, councellerLoading: true }));
    try {
      const payload = { branch: branchId ?? "", fromDate, toDate };
      const res = await getCouncellersListInTotalEnrollments(payload);
      setCounsellorData(res?.data?.enquirytakenbyData || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load counsellors");
    } finally {
      setLoadingStates(prev => ({ ...prev, councellerLoading: false }));
    }
  };

  const fetchStudents = async (counsellorId, fromDate, toDate) => {
    setLoadingStates(prev => ({ ...prev, studentLoading: true }));
    try {
      const res = await getStudentsListInTotalEnrollments({
        enquirytakenby: counsellorId,
        fromDate,
        toDate,
      });
      setStudentData(res?.data?.students || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoadingStates(prev => ({ ...prev, studentLoading: false }));
    }
  };

  // ================= HANDLERS =================
  const handleBranchSubmit = async (branchId) => {
    setActiveBranch(branchId);
    setActiveCounsellor(null);
    setStudentData([]);
    await fetchCounsellors(branchId, filterDates.fromDate, filterDates.toDate);
  };

  const handleCouncellorSubmit = async (counsellorId) => {
    setActiveCounsellor(counsellorId);
    await fetchStudents(counsellorId, filterDates.fromDate, filterDates.toDate);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilterDates(prev => ({ ...prev, [name]: value }));
  };

  const filterResetTotalEnrollementDates = async () => {
    setFilterDates({ fromDate: today, toDate: today });
    setActiveBranch(null);
    setActiveCounsellor(null);
    setStudentData([]);
    await fetchBranchData(today, today);
    Offcanvas.getInstance(document.getElementById("offcanvasRight"))?.hide();
  };

  const filterSubmitTotalEnrollemntDates = async () => {
    if (!filterDates.fromDate && !filterDates.toDate) {
      toast.error("Please fill in at least one filter criteria.");
      return;
    }
    setActiveBranch(null);
    setActiveCounsellor(null);
    setStudentData([]);
    await fetchBranchData(filterDates.fromDate, filterDates.toDate);
    Offcanvas.getInstance(document.getElementById("offcanvasRight"))?.hide();
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchBranchData(today, today); // loads both branch + counsellors
  }, []);

  // ================= UI =================
  return (
    <div>
      {/* Filter Button */}
      <div className="mb-2 card">
        <div className="card-body d-flex justify-content-end">
          <button
            className="btn btn_primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            <MdFilterList /> Filters
          </button>
        </div>
      </div>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" id="offcanvasRight">
        <div className="offcanvas-header">
          <h5>Filters</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          <input
            type="date"
            name="fromDate"
            value={filterDates.fromDate}
            onChange={handleDateChange}
            className="form-control mb-2"
          />
          <input
            type="date"
            name="toDate"
            value={filterDates.toDate}
            onChange={handleDateChange}
            className="form-control"
          />
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn_secondary" onClick={filterResetTotalEnrollementDates}>
              Clear
            </button>
            <Button className="btn btn_primary" onClick={filterSubmitTotalEnrollemntDates}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* 🔥 TABLES SIDE BY SIDE IN ONE ROW */}
      <div className="">
        
          <TodayEnrollmentsBranchTable
            enrolmentsInBranch={branchData}
            activeBranch={activeBranch}
            handleBranchSubmit={handleBranchSubmit}
            branchLoading={loadingStates.branchLoading}
          />
        
       
          <TodayEnrollmentsCounsellorTable
            enrollmentsByCouncellors={counsellorData}
            activeCouncellor={activeCounsellor}
            handleCouncellorSubmit={handleCouncellorSubmit}
            councellerLoading={loadingStates.councellerLoading}
          />
        
      </div>

      {/* Student Table (full width) */}
      {studentData.length > 0 && (
        <div className="row mt-3">
          <div className="col-12">
            <TodayEnrollmentsStudentTable
              councellerWiseStudentsDetails={studentData}
              studentLoading={loadingStates.studentLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayEnrollments;
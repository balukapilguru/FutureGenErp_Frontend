import React, { useState, useEffect } from 'react';
import { FaPhone, FaWhatsapp, FaCalendar, FaPen, FaCheckCircle, FaHistory, FaChevronLeft, FaTag, FaExclamationCircle, FaUserCircle, FaExclamationTriangle, FaStickyNote, FaCalendarAlt, FaPhoneVolume, FaRegCalendarAlt, FaPhoneAlt, FaUsers } from 'react-icons/fa';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { FaCalendarDay, FaClock, FaHandshake, FaRupeeSign, FaArrowLeft, FaBuilding } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { GrNotes } from 'react-icons/gr';
import { MdConnectWithoutContact } from 'react-icons/md';
import { BiCheckCircle } from 'react-icons/bi';

/**
 * LOADER: NotesByInstallmentsLoader
 * Fetches interaction history and installment details.
 */
export const NotesByInstallmentsLoader = async ({ params }) => {
  const { installmentId: id } = params;

  const res = await ERPApi.get(`/followuphistory/getbyid/${id}`);
  const StudentData = await ERPApi.get(`/fee/installmentById?installmentId=${id}`);

  return {
    timelindData: res.data,
    StudentData: StudentData.data?.installment,
  };
};

/**
 * ACTION: OverDueFeeRecordsListAction
 * Processes the creation of a new follow-up history record.
 */
export async function OverDueFeeRecordsListAction({ request }) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get('payload'));
  const installmentId = formData.get('installmentId');

  const payload = {
    note: data.notes,
    status: data.status,
    followUp_type: data.type,
    promise_amount: data.promisedAmount,
    promise_date: data.date,
    installment_id: installmentId,
  };

  const response = await toast.promise(
    ERPApi.post('followuphistory/create', payload),
    {
      loading: 'Saving follow-up history...',
      success: 'Follow-up history created successfully!',
      error: (err) => err?.response?.data?.message || 'Failed to create follow-up history',
    }
  );

  return response;
}

/**
 * UI COMPONENT: OverDueFeeRecordInstallmentsNotes (Exported as OverDueFeeRecordInstallmentsNotes)
 */


const OverDueFeeRecordInstallmentsNotes = ({ onBack }) => {
  const { timelindData, StudentData } = useLoaderData();
  const fetcher = useFetcher();
  const student = StudentData?.studentDetails;
  const installment = StudentData;
  const noteDate = new Date().toISOString().split("T")[0];
  

  const [formData, setFormData] = useState({
    type: 'Call',
    status: 'Pending',
    promisedAmount: '',
    notes: '',
    date: noteDate,
    dueamount: installment?.dueamount || 0,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (installment?.dueamount) {
      setFormData((prev) => ({ ...prev, dueamount: installment.dueamount }));
    }
    setIsLoading(false);
  }, [installment]);

  useEffect(() => {
    if (fetcher.state === 'idle' && isSubmitting) {
      setIsSubmitting(false);
      setFormData((prev) => ({ ...prev, notes: '', promisedAmount: '', date: '' }));
    }
  }, [fetcher.state]);

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = {};
    
    if (!formData.notes.trim()) {
      validationErrors.notes = 'Notes are required';
    } else if (formData.notes.trim().replace(/\s+/g, '').length < 10) {
      validationErrors.notes = 'Notes must be at least 10 characters long';
    }

    if (formData.promisedAmount && Number(formData.promisedAmount) > Number(formData.dueamount)) {
      validationErrors.promisedAmount = 'Promised amount must be equal or less than due amount';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.set('payload', JSON.stringify(formData));
    payload.set('installmentId', id);

    if (fetcher) {
      fetcher.submit(payload, {
        method: 'POST',
        encType: 'application/form-data',
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const msPerDay = 24 * 60 * 60 * 1000;
  const startDate = new Date(installment?.duedate);
  const today = new Date();
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const dueDays = Math.floor((today - startDate) / msPerDay);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-100 bg-light">

      {/* Main Content - Split Layout */}
      <div className="container-fluid p-0 h-100">
        <div className="row g-0 h-100">
          {/* Left Column - Work Area */}
          <div className="col-lg-8 h-100 overflow-auto">
            <div className="p-4">
              {/* Student Profile Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-0">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                      <FaUserCircle size={24} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="fs-16 fw-500 black_300 mb-1">{student?.name || 'N/A'}</h5>
                      <p className="fs-14 text-mute mb-0 mt-0 fw-100"><span className='fs-16 fw-500 black_300 mb-1'>Email : </span>{student?.email || 'No email provided'}</p>
                      <p className="fs-14 text-mute mb-0 mt-0 fw-100"><span className='fs-16 fw-500 black_300 mb-1'>Phone : </span>{student?.mobilenumber || 'N/A'}</p>
                    </div>
                  </div>

                <div className="card border-0 shadow-none mb-0">
                {/* Student Info Alert */}
                    <div className="card-body p-3">
                        <div className="alert alert-primary d-flex align-items-center justify-content-start  gap-2 py-1 px-2 mb-0" style={{ fontSize: '0.85rem' }} role="alert" >
                        👤 {installment.studentName} | 💰<span className='fw-bold text-danger'>₹{installment.dueamount?.toLocaleString("en-IN")} </span>  |<span className='d-flex align-items-center gap-3' >📅 {installment.duedate} 
                                <span
                                    className={`badge d-flex align-items-center gap-1 px-2 py-1 rounded-pill ${
                                    installment?.paymentdone
                                        ? 'bg-success bg-opacity-10 text-success'
                                        : 'bg-danger bg-opacity-10 text-danger'
                                    }`}
                                >
                                    <span className={`rounded-circle ${ installment?.paymentdone ? 'bg-success' : 'bg-danger'}`} style={{ width: '6px', height: '6px' }}></span>
                                    <span className="small fw-bold text-uppercase">
                                    {dueDays} d {installment?.paymentdone ? 'Paid' : 'Overdue'}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                </div>
              </div>

              {/* Follow-up Form */}
              {!installment?.paymentdone && (
                <div className="card border-0 shadow-sm">
  <div className="card-header bg-white border-bottom py-3">
    <div className="d-flex align-items-center gap-2">
      <h5 className="mb-0 fs-18 fw-500 black_300 mb-1">New Note</h5>
    </div>
  </div>

  <form onSubmit={(e) => handleSubmit(e, installment?.id)} className="card-body p-4">
    {/* Notes */}
    <div className="mb-4">
      <label className="form-label fs-14 fw-500 black_300 d-flex align-items-center gap-1">
        Conversation Notes
      </label>
      <textarea
        rows="4"
        className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
        placeholder="Summarize the conversation here..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />
      <div className="d-flex justify-content-between mt-1">
        {/* <span className="text-muted small">
          Characters: {formData.notes.replace(/\s+/g, '').length}
        </span> */}
        {errors.notes && (
          <span className="text-danger small fw-semibold">{errors.notes}</span>
        )}
      </div>
    </div>

    {/* Row 1: Medium, Promised Amount, Promise Date */}
    <div className="row g-3 mb-3">
      <div className="col-md-4">
        <label className="form-label fs-14 fw-500 black_300 d-flex align-items-center gap-1">
          Interaction Type
        </label>
        <select
          className="form-select"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="Call">Call</option>
          <option value="Counsel">Counsel (Meeting/Consultation)</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Direct Visit">Direct Visit</option>
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label fs-14 fw-500 black_300 d-flex align-items-center gap-1">
         
          Promised Amount
        </label>
       <input
  type="number"
  className={`form-control ${errors.promisedAmount ? 'is-invalid' : ''}`}
  placeholder="0"
  value={formData.promisedAmount}
  onChange={(e) => {
    const value = e.target.value;
    setErrors({
        ...errors,
        promisedAmount:""
  })
    // Prevent negative values
    if (Number(value) >= 0 || value === '') {
      setFormData({ ...formData, promisedAmount: value });
    }
  }}
  min={0} // HTML5 constraint
  max={formData.dueamount}
/>

        {errors.promisedAmount && (
          <div className="invalid-feedback d-block">{errors.promisedAmount}</div>
        )}
      </div>

      <div className="col-md-4">
        <label className="form-label fs-14 fw-500 black_300 d-flex align-items-center gap-1">
          Promise Date
        </label>
        <input
          type="date"
          className="form-control"
          value={formData.date}
          onChange={(e) =>{ setFormData({ ...formData, date: e.target.value }) 
           setErrors({
        ...errors,
        date:""
  })
            }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>

    {/* Row 2: Status */}
    <div className="row g-3 mb-3">
      <div className="col-md-4">
        <label className="form-label fs-14 fw-500 black_300 d-flex align-items-center gap-1">
          Current Status
        </label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
          <option value="Promised">Payment Promised</option>
          <option value="Visit Scheduled">Visit Scheduled</option>
          <option value="Negotiating">Negotiating / Discount</option>
          <option value="Busy">Busy / Call Back</option>
          <option value="No Response">No Response</option>
          <option value="Switch Off">Switch Off</option>
          <option value="Delayed">Payment Delayed</option>
          <option value="Resolved">Resolved / Paid</option>
        </select>
      </div>
{/* 
      <div className="col-md-12">
        <div
          className="alert alert-primary py-1 px-2 mb-0"
          style={{ fontSize: '0.85rem' }}
          role="alert"
        >
          👤 {installment.studentName} | 💰 ₹{installment.dueamount} | 📅 {installment.duedate}
        </div>
      </div> */}
    </div>

    {/* Submit Button */}
    <div className="d-flex justify-content-end pt-3 border-top">
      <button
        type="submit"
        className="btn btn_primary d-flex align-items-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status"></span>
            Syncing...
          </>
        ) : 'Save Interaction'}
      </button>
    </div>
  </form>
</div>

              )}
            </div>
          </div>

          {/* Right Column - Communication Trail */}
          <div className="col-lg-4 h-100 overflow-auto border-start bg-white">
            <div className="sticky-to bg-white border-bottom py-3 px-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <FaHistory size={18} className="fs-16 fw-400 black_300 mb-1" />
                  <h5 className="fs-16 fw-500 black_300 mb-1">Interaction Timeline</h5>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {timelindData?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-light">
              {timelindData && timelindData.length > 0 ? (
                <div className="position-relative ps-1">
                  {/* Timeline Line */}
                  {/* <div className="position-absolute start-0 top-0 h-100 border-start" style={{ left: '7px' }}></div> */}
                  
                  {timelindData.map((item, idx) => (
                    <div className="position-relative mb-4 overflow-hidden">


  {/* Card */}
  <div className="position-relative rounded-4 overflow-hidden">
                        <div className="position-absolute bg-warning h-100" style={{width:"3px"}}></div>
    <div className="bg-white rounded-4 p-3 shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="fs-14 fw-500 black_300 text-uppercase">
          {item.followUp_type}
        </div>

        <span
          className={`badge rounded-pill small ${
            item.status === 'Completed'
              ? 'bg-success bg-opacity-10 text-success'
              : 'bg-warning bg-opacity-10 text-warning'
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Created At */}
      <div className="text-muted small mb-2">
        {new Date(item.createdAt).toLocaleString()}
      </div>

      {/* Note */}
      <div className="fst-italic text-muted small mb-3">
        “{item.note || 'No notes provided'}”
      </div>

      {/* Bottom Section */}
      <div className="bg-light rounded-3 p-2 d-flex gap-4">
        {/* Expected Sum */}
        <div>
          <div className="text-muted text-uppercase small  fs-12 fw-500 black_300 mb-1">
            Promised Amount
          </div>
          <div className="fw-bold text-success small">
            ₹{item.promise_amount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Payment Target */}
        <div>
          <div className="text-muted text-uppercase small fs-12 fw-500 black_300 mb-1">
            Promised Date
          </div>
          <div className="fs-14 fw-500 black_300 d-flex align-items-center gap-1">
            <FaRegCalendarAlt size={12} />
            {new Date(item.promise_date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaHistory size={48} className="text-muted opacity-25 mb-3" />
                  <p className="text-muted">No history available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverDueFeeRecordInstallmentsNotes;







































































// import React, { useState } from 'react';
// import { BiBook, BiCheckCircle, BiInfoCircle } from 'react-icons/bi';
// import { BsClock } from 'react-icons/bs';
// import { FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa';
// import { LiaCalendarDaySolid } from 'react-icons/lia';
// import { PiNotebook } from 'react-icons/pi';
// import { ERPApi } from '../../../../../serviceLayer/interceptor';
// import { useLoaderData } from 'react-router-dom';
// import BackButton from '../../../../components/backbutton/BackButton';
// import { IoCall } from 'react-icons/io5';
// // Lucide-react icons used for a clean, consistent UI (Confirmed as working in this environment)


// export const  NotesByInstallmentsLoader = async ({ params }) => {
//     const { installmentId: id } = params;

//     const res = await ERPApi(`/followuphistory/getbyid/${id}`);
//     const Installment = await ERPApi(`/fee/installment?installmentId=${id}`);
//     return {timelindData : res.data,installment : Installment };

// }



// // --- Component for a Single Interaction Card (Read-Only View) ---
// const CallCard = ({ item, index, onCardClick }) => {
//     // Determine status badge color and icon
//     let statusColor, statusIcon;
//     const ICON_SIZE = 14;

//     switch (item?.status) {
//         case 'Closed':
//             statusColor = 'text-bg-success';
//             statusIcon = <BiCheckCircle size={ICON_SIZE} className="me-1" />;
//             break;
//         default: // Pending, Process
//             statusColor = 'text-bg-warning';
//             statusIcon = <BsClock size={ICON_SIZE} className="me-1" />;
//             break;
//     }

//     // Determine type avatar initials (first letter of type)
//     // Accessing item.followUp_type based on user input
//     const typeInitial = item?.followUp_type ? item.followUp_type[0].toUpperCase() : '??';

//     // Format date nicely
//     // Accessing item.promise_date based on user input
//     const formattedDate = item?.promise_date ? new Date(item.promise_date).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     }) : 'N/A';

//     // Format amount as currency
//     // Accessing item.promise_amount based on user input
//     const formattedAmount = item?.promise_amount != null
//         ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.promise_amount)
//         : 'N/A';

//     return (
//         <div className="col-lg-4 col-md-6 col-12">
//             {/* Card acts as a clickable element to open details modal */}
//             <div
//                 key={index + 1}
//                 className="text-decoration-none d-block h-100 cursor-pointer"
//                 onClick={() => onCardClick(item)} // Trigger modal on click
//             >
//                 <div className="card shadow-sm border-0 rounded-3 h-100 transition-shadow">
//                     <div className="card-body p-3 d-flex flex-column">

//                         {/* Top Row: Type Avatar, Status, and Date */}
//                         <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
//                             <div className="d-flex align-items-center gap-2">
//                                 {/* Type Avatar/Initial */}
//                                 <div className={`rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-6`}
//                                     style={{ width: '40px', height: '40px' }}>
//                                     {typeInitial}
//                                 </div>
//                                 <div>
//                                     <span className="small text-muted d-block">FollowUp Type</span>
//                                     <h5 className="h6 fw-bold mb-0 text-dark">
//                                         {item?.followUp_type || 'N/A'}
//                                     </h5>
//                                 </div>
//                             </div>

//                             {/* Status and Date */}
//                             <div className="text-end">
//                                 <span className={`badge ${statusColor} text-uppercase mb-1 d-flex align-items-center justify-content-center`}>
//                                     {statusIcon}
//                                     {item?.status || 'Unknown'}
//                                 </span>
//                                 <div className="small text-muted mt-1 d-flex align-items-center justify-content-end">
//                                     <LiaCalendarDaySolid size={ICON_SIZE} className="me-1" />
//                                     {formattedDate}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Middle Section: Notes (Truncated) */}
//                         <div className="flex-grow-1 mb-3">
//                             <span className="small text-muted d-block mb-1 d-flex align-items-center">
//                                 <PiNotebook size={ICON_SIZE} className="me-1" />
//                                 Note
//                             </span>
//                             <p className="card-text text-dark small overflow-hidden"
//                                 style={{ maxHeight: '3em', lineHeight: '1.5em' }}>
//                                 {item?.note || 'No note provided for this interaction.'}
//                             </p>
//                         </div>

//                         {/* Bottom Row: Promised Amount */}
//                         <div className="mt-auto pt-2 border-top">
//                             <div className="d-flex align-items-center justify-content-between small text-dark">
//                                 <strong>Promised Amount:</strong>
//                                 <span className="fw-bolder text-success fs-6 d-flex align-items-center">
//                                     {/* <FaDollarSign size={16} className="me-1" /> */}
//                                     {formattedAmount}
//                                 </span>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Application Component ---
// const OverDueFeeRecordInstallmentsNotes = () => {

//     const data = useLoaderData();

//     const [showDetailsModal, setShowDetailsModal] = useState(false); // Modal for viewing details
//     const [selectedItem, setSelectedItem] = useState(null); // The item being viewed

//     // Handlers for Details Modal (Card Click)
//     const handleCardClick = (item) => {
//         setSelectedItem(item);
//         setShowDetailsModal(true);
//     };

//     const handleCloseDetailsModal = () => {
//         setSelectedItem(null);
//         setShowDetailsModal(false);
//     };

//     // Helper function to render detail lines in the modal
//     const renderDetailLine = (Icon, label, value, colorClass = 'text-dark') => (
//         <div className="d-flex align-items-start mb-2">
//             <div>
//                 <strong className="d-block small text-muted">{label}</strong>
//                 <div className="flex items-center gap-2">
//                     <Icon size={15} className={`me-2 ${colorClass}`} />
//                 <span className={colorClass}>{value}</span>
//                 </div>
//             </div>
//         </div>
//     );


//     return (
//         <div className="">
            
//             <BackButton heading={`Total Notes: ${data.length}`} content="Back" />

//             <div className="m-2 mt-2 p-3">
//                 <div className="row g-4">
//                 {data.map((item, index) => (
//                     <CallCard
//                         key={item.id}
//                         item={item}
//                         index={index}
//                         onCardClick={handleCardClick}
//                     />
//                 ))}
//                 {data.length === 0 && (
//                     <div className="col-12">
//                         <div className="alert alert-info text-center mb-0" role="alert">
//                             No follow-up notes found for this installment.
//                         </div>
//                     </div>
//                 )}
//             </div>
//             </div>

//             {/* --- Interaction Details Modal --- */}
//             {showDetailsModal && selectedItem && (
//                 <>
//                     <div
//                         className="modal fade show d-flex align-items-center justify-content-center"
//                         style={{
//                             display: 'block',
//                             position: 'fixed',
//                             top: 0,
//                             left: 0,
//                             width: '100%',
//                             height: '100%',
//                             zIndex: 1060,
//                             overflowX: 'hidden',
//                             overflowY: 'auto',
//                             backgroundColor: 'rgba(0, 0, 0, 0.6)'
//                         }}
//                         tabIndex="-1"
//                         aria-labelledby="interactionDetailsModalLabel"
//                         aria-hidden="true"
//                     >
//                         <div className="modal-dialog modal-md">
//                             <div className="modal-content shadow-xl rounded-4 border-0">
//                                 <div className="modal-header bg_primary text-white">
//                                     <h5 className="modal-title fw-bold" id="interactionDetailsModalLabel">
//                                         <BiInfoCircle size={20} className="me-2" />
//                                         Interaction Details
//                                     </h5>
//                                     <button
//                                         type="button"
//                                         className="btn-close btn-close-white"
//                                         onClick={handleCloseDetailsModal}
//                                         aria-label="Close"
//                                     ></button>
//                                 </div>
//                                 <div className="modal-body">

//                                     {/* Main Details Grid */}
//                                     <div className="row mb-3">
//                                         <div className="col-6">
//                                             {renderDetailLine(
//                                                 FaRegCalendarAlt,
//                                                 "Promise Date",
//                                                 new Date(selectedItem.promise_date).toLocaleDateString('en-IN', {
//                                                     year: 'numeric', month: 'long', day: 'numeric'
//                                                 })
//                                             )}
//                                         </div>
//                                         <div className="col-6">
//                                             {renderDetailLine(
//                                                 selectedItem.followUp_type === 'Call' ? IoCall : BiBook,
//                                                 "Follow up Type",
//                                                 selectedItem.followUp_type
//                                             )}
//                                         </div>
//                                         <div className="col-6">
//                                             {renderDetailLine(
//                                                 FaRupeeSign,
//                                                 "Promise Amount",
//                                                 selectedItem.promise_amount,
//                                                 'text-success'
//                                             )}
//                                         </div>
//                                         <div className="col-6">
//                                             {renderDetailLine(
//                                                 selectedItem.status === 'Closed' ? BiCheckCircle : BsClock,
//                                                 "Status",
//                                                 selectedItem.status,
//                                                 selectedItem.status === 'Closed' ? 'text-success' : 'text-warning'
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Full Notes Section */}
//                                     <div className="border-top pt-3">
//                                         <h6 className="fw-bold d-flex align-items-center mb-2 text-primary">
//                                             <PiNotebook size={18} className="me-2" />
//                                             Note
//                                         </h6>
//                                         <p className="text-muted small">
//                                             {selectedItem.note || "No detailed note available."}
//                                         </p>
//                                     </div>

//                                 </div>
//                                 <div className="modal-footer">
//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary"
//                                         onClick={handleCloseDetailsModal}
//                                     >
//                                         Close
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}

//         </div>
//     );
// };

// export default OverDueFeeRecordInstallmentsNotes;



//             // <style jsx="true">{`
//             //     /* Simple CSS for Bootstrap Card Hover Effect */
//             //     .transition-shadow {
//             //         transition: box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out;
//             //     }
//             //     .transition-shadow:hover {
//             //         box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
//             //         transform: translateY(-2px);
//             //     }
//             //     .card-text {
//             //         display: -webkit-box;
//             //         -webkit-line-clamp: 2;
//             //         -webkit-box-orient: vertical;  
//             //     }
//             //     .modal-backdrop.show {
//             //         opacity: 0.5; /* Ensure backdrop is visible */
//             //     }
//             //     /* Ensure icons integrate nicely with text flow */
//             //     .card-body svg {
//             //         vertical-align: sub;
//             //     }
//             //     .cursor-pointer {
//             //         cursor: pointer;
//             //     }
//             // `}</style>
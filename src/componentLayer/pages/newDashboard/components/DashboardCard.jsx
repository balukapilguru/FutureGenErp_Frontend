import { Link } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { RxDotFilled } from "react-icons/rx";
import CountUp from "../../../../utils/CountUp";

const DashboardCard = ({ tab, active, handleTabs, value, withGstValue, liveCount }) => {
  const isLinkCard = tab.id === "FeeFollowUps";

  const handleClick = () => {
    if (!isLinkCard && handleTabs) handleTabs(tab.id);
  };

  const cardContent = (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="flex-grow-1 overflow-hidden">
          <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
            {tab.title}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
        <div className="text-start">
          <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
            {tab.showRupee && <LiaRupeeSignSolid />}
            <CountUp finalValue={Number(value) } />
            {/* {value.toLocaleString('en-IN')}  */}
          </h4>

          {/* Subtext */}
          {withGstValue && (
            <div className="fs-xs fw-500">
              {tab.linkText} <LiaRupeeSignSolid />
              <CountUp finalValue={withGstValue || 0} />
              {/* {withGstValue.toLocaleString('en-IN')} */}
            </div>
          )}

          {tab.id === "TotalUsers" ? (
            <Link to={tab.linkTo || ""} className="fs-xs fw-500">
              <span className="text-success">
                <RxDotFilled />
              </span>
              Live {liveCount.toLocaleString('en-IN')}
            </Link>
          ) : (
            tab.linkText && !withGstValue&& (
              <Link to={tab.linkTo || ""} className="fs-xs fw-500">
                {tab.linkText}
              </Link>
            )
          )}
        </div>

        <div className="avatar-sm flex-shrink-0">
          <span className={`avatar-title ${tab.iconBg} rounded fs-3`}>
            {tab.icon}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLinkCard ? (
        <Link to={tab.linkTo}>
          <button
            className={`card nav-link card_animate ${active ? "active" : ""}`}
            id={`pills-${tab.id}-tab`}
            data-bs-toggle="pill"
            data-bs-target={`#pills-${tab.id}`}
            type="button"
            role="tab"
            aria-controls={`pills-${tab.id}`}
            aria-selected={active}
          >
            {cardContent}
          </button>
        </Link>
      ) : (
        <button
          className={`card nav-link card_animate ${active ? "active" : ""}`}
          id={`pills-${tab.id}-tab`}
          data-bs-toggle="pill"
          data-bs-target={`#pills-${tab.id}`}
          type="button"
          role="tab"
          aria-controls={`pills-${tab.id}`}
          aria-selected={active}
          onClick={handleClick}
        >
          {cardContent}
        </button>
      )}
    </>
  );
};

export default DashboardCard;

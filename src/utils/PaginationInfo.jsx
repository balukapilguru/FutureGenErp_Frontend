import React from 'react';
const PaginationInfo = ({ data, loading }) => {

  return (
    <div className="text_mute pagination-text">
      {data ? (
        // loading ? (
        //   <div>Showing data is Loading ....</div>
        // ) :
         (
          <div>
            Showing{' '}
            <span className="fw-semibold">{data?.start}</span>{' '}
            to{' '}
            <span className="fw-semibold">{data?.end}</span>{' '}
            of{' '}
            <span className="fw-semibold">{data?.total}</span>{' '}
            Results
          </div>
        )
      ) : (
        <div>
          Showing <span className="fw-semibold">0</span>{' '}
          to{' '}
          <span className="fw-semibold">0</span>{' '}
          of{' '}
          <span className="fw-semibold">{data?.total}</span>{' '}
          Results
        </div>
      )}
    </div>
  );
};

export default PaginationInfo;

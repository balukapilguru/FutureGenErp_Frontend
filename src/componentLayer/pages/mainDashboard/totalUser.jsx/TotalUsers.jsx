const TotalUsers = () => {
  return (
    <div>
      <div className="col-lg-6">
        {/* Branchwise Councelloers */}

        <div className="card">
          <div className="card-header">
            <div className="card-body">
              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                  <thead>
                    <tr className="">
                      <th scope="col" className="fs-13 lh-xs fw-600  ">
                        S.No
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600  ">
                        Username
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600  ">
                        Profile
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fs-13 black_300 fw-500 lh-xs bg_light "></td>
                      <td className="fs-13 black_300  lh-xs bg_light"></td>
                      <td className="fs-13 black_300  lh-xs bg_light"></td>
                    </tr>

                  
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalUsers;

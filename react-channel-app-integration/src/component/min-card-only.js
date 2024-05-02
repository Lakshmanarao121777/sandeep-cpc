import React from "react";

const MinCardOnly = ({customer}) => {
    let customerName = customer.customerName;
    let customerAddress = customer.customerAddress;
    
  return (
    <div>
    
      <form id="MinCardOnly">
        <div className="row mb-3">
          <div className="col-sm-12">
            <div className="row gy-5 cc-pad-bottom-20">
              <div className="col-12 title-border-bottom">
                <strong>DEFAULT NAME & ADDRESS</strong>
              </div>
            </div>
            <div className="row cc-pad-bottom-40">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <label htmlFor="jump-first-name" className="form-label">
                  <strong>First name:</strong> {customerName.firstName}
                </label>
                <div name="jump-first-name" type="text"></div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <label htmlFor="jump-last-name" className="form-label">
                <strong>Last name:</strong> {customerName.lastName}
                </label>
                <div name="jump-last-name" type="text"></div>
              </div>
            </div>

            <div className="row gy-3 cc-pad-bottom-10">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <label className="form-label"><strong>Address:</strong> {customerAddress.address}</label>
                <div name="jump-address" type="text"></div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <label className="form-label"><strong>Line2:</strong> {customerAddress.addressLine2}</label>
                <div name="jump-line2" type="text"></div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <label className="form-label"><strong>City:</strong> {customerAddress.city}</label>
                <div name="jump-city" type="text"></div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <label className="form-label"><strong>State:</strong> {customerAddress.state}</label>
                <div name="jump-state" type="text"></div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <label className="form-label"><strong>Zip code:</strong> {customerAddress.zipCode}</label>
                <div name="jump-zip-code" type="text"></div>
              </div>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
};

export default MinCardOnly;


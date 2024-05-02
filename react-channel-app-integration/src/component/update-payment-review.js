import React, { Fragment } from "react";
import { useHistory } from "react-router";

const UpdatePaymentReview = ({ paymentInfo, onEdit }) => {
  let cpcInfo = paymentInfo?.cpcData;
  const history = useHistory();
  function onEditLocal() {
    onEdit();
    history.push("/");
  }  
  return (
    <Fragment>      
      <div className="alert alert-success" role="alert">
        <strong>Your payment have been updated successfully! &nbsp; <a className="text-primary" onClick={onEditLocal} >Edit</a></strong>
      </div>      
    </Fragment>
  );
};

export default UpdatePaymentReview;

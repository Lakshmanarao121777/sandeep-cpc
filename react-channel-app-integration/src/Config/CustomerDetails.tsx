import React, { useState } from "react";
import { Row, Col, Form, Accordion } from "react-bootstrap";
import PropTypes from "prop-types";
import { isPropertyValid } from "./utils";
import { Address } from "./Address";
import { Userroles } from "./Userroles";

export const CustomerDetails = (props: any) => {
  const { handleChannelData, channelData } = props;
  const [customerDetails, setCustomerDetails] = useState([
    { name: "walletId", value: channelData.customerDetails.walletId, disabled: !isPropertyValid(channelData.customerDetails.walletId) },
    { name: "billingArrangementId", value: channelData.customerDetails.billingArrangementId, disabled: !isPropertyValid(channelData.customerDetails.billingArrangementId) },
    { name: "firstName", value: channelData.customerDetails.firstName, disabled: !isPropertyValid(channelData.customerDetails.firstName) },
    { name: "lastName", value: channelData.customerDetails.lastName, disabled: !isPropertyValid(channelData.customerDetails.lastName) },
    { name: "displayAddress", value: channelData.customerDetails.displayAddress, disabled: !isPropertyValid(channelData.customerDetails.displayAddress) },
    { name: "address", value: channelData.customerDetails.address, disabled: !isPropertyValid(channelData.customerDetails.address) },
    { name: "addressLine2", value: channelData.customerDetails.addressLine2, disabled: !isPropertyValid(channelData.customerDetails.addressLine2) },
    { name: "city", value: channelData.customerDetails.city, disabled: !isPropertyValid(channelData.customerDetails.city) },
    { name: "state", value: channelData.customerDetails.state, disabled: !isPropertyValid(channelData.customerDetails.state) },
    { name: "zip", value: channelData.customerDetails.zip, disabled: !isPropertyValid(channelData.customerDetails.zip) },
    {
      name: "storePaymentInstrumentLongTerm",
      value: channelData.customerDetails.storePaymentInstrumentLongTerm,
      disabled: !isPropertyValid(channelData.customerDetails.storePaymentInstrumentLongTerm),
    },
    {
      name: "cimaToken",
      value: channelData.customerDetails.cimaToken,
      disabled: !isPropertyValid(channelData.customerDetails.cimaToken),
    },
  ]);
  const changeCustomerDetailsHandle = (e: any, type: string) => {
    let customerDetailsData = customerDetails.map((customerDetail) => {
      if (customerDetail.name === e.target.name) {
        return {
          ...customerDetail,
          [type]: (type === 'disabled' ? !e.target.checked : (e.target.name === 'displayAddress' || e.target.name === 'storePaymentInstrumentLongTerm') ? e.target.value : e.target.value)
        };
      } else {
        return customerDetail;
      }
    })
    setCustomerDetails(customerDetailsData)
    let data = customerDetailsData.filter(config => {
      if (!config.disabled) {
        return config
      }
    })
    let dataFinal = {}
    data.forEach((d) => {
      dataFinal = { ...dataFinal, [d.name]: d.value === undefined ? false : d.value }
    })
    handleChannelData('customerDetails', dataFinal)
  }
  const handleSubData = (type: string, data: any) => {
    let cData = channelData;
    cData.customerDetails[type] = data;
    handleChannelData('customerDetails', cData.customerDetails)
  }
  return (
    <Row>
      {customerDetails.map((customerDetail, i) => {
        // if (customerDetail === 'addressList') {
        //   return 'address list'
        // } else if (customerDetail === 'userRoleList') {
        //   return 'user role list'
        // } else {

        return (
          <Col key={i} sm="12">
            <Row>
              <Col>
                <Form.Check
                  onChange={e => changeCustomerDetailsHandle(e, 'disabled')}
                  type="checkbox"
                  disabled={!customerDetail.name}
                  label={customerDetail.name}
                  name={customerDetail.name}
                  id={customerDetail.name}
                  checked={!customerDetail.disabled} />
              </Col>
              <Col>
                {
                  (customerDetail.name === 'displayAddress' || customerDetail.name === 'storePaymentInstrumentLongTerm') ?
                    <Form.Switch
                      type="checkbox"
                      onChange={e => changeCustomerDetailsHandle(e, 'value')}
                      disabled={customerDetail.disabled}
                      checked={customerDetail.value}
                      name={customerDetail.name}
                    /> :
                    <Form.Control
                      type="text"
                      onChange={e => changeCustomerDetailsHandle(e, 'value')}
                      disabled={customerDetail.disabled}
                      value={customerDetail.value ? customerDetail.value : ''}
                      name={customerDetail.name}
                    />
                }
              </Col>
            </Row>
          </Col>
        );
        // }
      })}
      <Col>
        <hr />
        <Address channelData={channelData} handleSubData={handleSubData} />
        <hr />
        {
          channelData.config?.enableMultipleUserSelection &&
          <Userroles channelData={channelData} handleSubData={handleSubData} />
        }
      </Col>
    </Row >
  );
};

CustomerDetails.propTypes = {
  handleChannelData: PropTypes.func,
  channelData: PropTypes.any,
};

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Form, Row } from "react-bootstrap";
// type Props = {};

const Address = (props: any) => {
  const { channelData, handleSubData } = props;
  const list = channelData?.customerDetails?.addressList?.map((address: any, i: number) => {
    return {
      value: address,
      disabled: false,
      name: `address${i}`
    };
  });
  const [addressList, setAddressList] = useState(list);


  const changeAddressHandle = (e: any, type: string) => {
    const addressListData = addressList?.map((address: any) => {
      if (address.name === e.target.name) {
        return {
          ...address,
          [type]: type === "disabled" ? !e.target.checked : e.target.value,
        };
      } else {
        return address;
      }
    });
    setAddressList(addressListData)
    let data = addressListData.filter((address: any) => {
      if (!address.disabled) {
        return address.value;
      }
    });
    let dataFinal = data.map((d: any) => {
      return d.value
    })
    handleSubData("addressList", dataFinal);
  };

  return (
    <div>
      <Row>
        {addressList.map((address: any, i: number) => {
          return (
            <Col key={i} sm="12">
              <Row>
                <Col sm="1">
                  <Form.Check
                    onChange={(e) => changeAddressHandle(e, "disabled")}
                    type="checkbox"
                    // disabled={address.disabled}
                    // label={address.name}
                    name={address.name}
                    id={address.name}
                    checked={!address.disabled}
                  />
                </Col>
                <Col>
                  {address.value.address} , {address.value.addressLine2} , {address.value.city}, {address.value.state},{" "}
                  {address.value.zip}
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

Address.propTypes = {
  channelData: PropTypes.object,
  handleSubData: PropTypes.func,
};

export { Address };

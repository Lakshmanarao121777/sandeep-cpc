import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Form, Row } from "react-bootstrap";
// type Props = {};

export const Userroles = (props: any) => {
  const { channelData, handleSubData } = props;
  const list = channelData?.customerDetails?.userRoleList?.map((userRole: any, i: number) => {
    return {
      value: userRole,
      disabled: false,
      name: `userRole${i}`
    };
  });
  const [userRoleList, setAddressList] = useState(list);


  const changeAddressHandle = (e: any, type: string) => {
    const userRoleListData = userRoleList?.map((userRole: any) => {
      if (userRole.name === e.target.name) {
        return {
          ...userRole,
          [type]: type === "disabled" ? !e.target.checked : e.target.value,
        };
      } else {
        return userRole;
      }
    });
    setAddressList(userRoleListData)
    let data = userRoleListData.filter((userRole: any) => {
      if (!userRole.disabled) {
        return userRole.value;
      }
    });
    let dataFinal = data.map((d: any) => {
      return d.value
    })
    handleSubData("userRoleList", dataFinal);
  };

  return (
    <div>
      <Row>
        {userRoleList.map((userRole: any, i: number) => {
          return (
            <Col key={i} sm="12">
              <Row>
                <Col sm="1">
                  <Form.Check
                    onChange={(e) => changeAddressHandle(e, "disabled")}
                    type="checkbox"
                    // disabled={userRole.disabled}
                    // label={userRole.name}
                    name={userRole.name}
                    id={userRole.name}
                    checked={!userRole.disabled}
                  />
                </Col>
                <Col>
                  {userRole.value.userId} ({userRole.value.role}) <br /> {userRole.value.walletId}
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

Userroles.propTypes = {
  channelData: PropTypes.object,
  handleSubData: PropTypes.func,
};


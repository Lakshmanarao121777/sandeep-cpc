import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { isPropertyValid } from "./utils";

export const AgentDetails = (props: any) => {
  const { handleChannelData, channelData } = props;
  const [agentDetails, setAgentDetails] = useState([
    {
      name: "azureAdToken",
      value: channelData.agentDetails.azureAdToken,
      disabled: !isPropertyValid(channelData.agentDetails.azureAdToken),
    },
  ]);
  const changeAgentDetailsHandle = (e: any, type: string) => {
    let agentDetailsData = agentDetails.map((agentDetails) => {
      if (agentDetails.name === e.target.name) {
        return {
          ...agentDetails,
          [type]: (type === 'disabled' ? !e.target.checked : e.target.value)
        };
      } else {
        return agentDetails;
      }
    })
    setAgentDetails(agentDetailsData)
    let data = agentDetailsData.filter(config => {
      if (!config.disabled) {
        return config
      }
    })
    let dataFinal = {}
    data.forEach((d) => {
      dataFinal = { ...dataFinal, [d.name]: d.value === undefined ? false : d.value }
    })
    handleChannelData('agentDetails', dataFinal)
  }
  return (
    <Row>
      {agentDetails.map((agentDetails, i) => {
        // if (agentDetails === 'addressList') {
        //   return 'address list'
        // } else if (agentDetails === 'userRoleList') {
        //   return 'user role list'
        // } else {

        return (
          <Col key={i} sm="12">
            <Row>
              <Col>
                <Form.Check
                  onChange={e => changeAgentDetailsHandle(e, 'disabled')}
                  type="checkbox"
                  disabled={!agentDetails.name}
                  label={agentDetails.name}
                  name={agentDetails.name}
                  id={agentDetails.name}
                  checked={!agentDetails.disabled} />
              </Col>
              <Col>
                <Form.Control
                  as="textarea"
                  onChange={e => changeAgentDetailsHandle(e, 'value')}
                  disabled={agentDetails.disabled}
                  value={agentDetails.value ? agentDetails.value : ''}
                  name={agentDetails.name}
                />
              </Col>
            </Row>
          </Col>
        );
        // }
      })}
    </Row>
  );
};

AgentDetails.propTypes = {
  handleChannelData: PropTypes.func,
  channelData: PropTypes.any,
};

import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { isPropertyValid } from "./utils";
import { channelTemplateMapping } from "./data/channelTemplateMapping";

export const ChannelDetails = (props: any) => {
  const { handleChannelData, channelData, template, setTemplate } = props;
  const [channelDetails, setChannelDetails] = useState([
    // { name: "sourceServerId", value: channelData.channelDetails.sourceServerId, disabled: !isPropertyValid(channelData.channelDetails.sourceServerId) },
    // { name: "sourceSystemId", value: channelData.channelDetails.sourceSystemId, disabled: !isPropertyValid(channelData.channelDetails.sourceSystemId) },
    // { name: "timestamp", value: channelData.channelDetails.timestamp, disabled: !isPropertyValid(channelData.channelDetails.timestamp) },
    // { name: "partnerId", value: channelData.channelDetails.partnerId, disabled: !isPropertyValid(channelData.channelDetails.partnerId) },
    // { name: "sessionId", value: channelData.channelDetails.sessionId, disabled: !isPropertyValid(channelData.channelDetails.sessionId) },
    { name: "channelName", value: channelData.channelDetails.channelName, disabled: !isPropertyValid(channelData.channelDetails.channelName) },
    // { name: "enableFraudManager", value: channelData.channelDetails.enableFraudManager, disabled: !isPropertyValid(channelData.channelDetails.enableFraudManager) },
    // { name: "merchantId", value: channelData.channelDetails.merchantId, disabled: !isPropertyValid(channelData.channelDetails.merchantId) },
    { name: "cpcMessageDisplayLocation", value: channelData.channelDetails.cpcMessageDisplayLocation, disabled: !isPropertyValid(channelData.channelDetails.cpcMessageDisplayLocation) },
    { name: "customerClass", value: channelData.channelDetails.customerClass, disabled: !isPropertyValid(channelData.channelDetails.customerClass) },
    // { name: "requirePaymentMethodSelection", value: channelData.channelDetails.requirePaymentMethodSelection, disabled: !isPropertyValid(channelData.channelDetails.requirePaymentMethodSelection) },
  ]);
  const changeChannelDetailsHandle = (e: any, type: string) => {
    let channelDetailsData = channelDetails.map((customerDetail) => {
      if (customerDetail.name === e.target.name) {
        return {
          ...customerDetail,
          [type]: (type === 'disabled' ? !e.target.checked : (e.target.name === 'requirePaymentMethodSelection' || e.target.name === 'enableFraudManager') ? e.target.value : e.target.value)
        };
      } else {
        return customerDetail;
      }
    })
    setChannelDetails(channelDetailsData)
    let data = channelDetailsData.filter(config => {
      if (!config.disabled) {
        return config
      }
    })
    let dataFinal = {}
    data.forEach((d) => {
      dataFinal = { ...dataFinal, [d.name]: d.value === undefined ? false : d.value }
    })
    handleChannelData('channelDetails', dataFinal)
  }
  return (
    <Row>
      {channelDetails.map((customerDetail, i) => {
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
                  onChange={e => changeChannelDetailsHandle(e, 'disabled')}
                  type="checkbox"
                  disabled={!customerDetail.name}
                  label={customerDetail.name}
                  name={customerDetail.name}
                  id={customerDetail.name}
                  checked={!customerDetail.disabled} />
              </Col>
              <Col>
                {
                  (customerDetail.name === 'requirePaymentMethodSelection' || customerDetail.name === 'enableFraudManager') ?
                    <Form.Switch
                      type="checkbox"
                      onChange={e => changeChannelDetailsHandle(e, 'value')}
                      disabled={customerDetail.disabled}
                      checked={customerDetail.value}
                      name={customerDetail.name}
                    />
                    : (customerDetail.name === 'channelName') ?
                      <Row>
                        <Col sm="12">
                          <Form.Select name={customerDetail.name} value={customerDetail.value} onChange={e => changeChannelDetailsHandle(e, 'value')}>
                            {channelTemplateMapping.map(item => item.channel)
                              .filter((value, index, self) => self.indexOf(value) === index).map((channel, i) => {
                                return <option value={channel} key={i}>{channel}</option>
                              })}
                          </Form.Select>
                        </Col>
                        <Col sm="12">
                          <Form.Select name='template' value={template} onChange={e => setTemplate(e.target.value)}>
                            <option value={''} >{'select'}</option>
                            {
                              channelTemplateMapping
                                .filter(item => { return item.channel === customerDetail.value })
                                .map(item => item.template)
                                .filter((value, index, self) => self.indexOf(value) === index).map((template, i) => {
                                  return <option value={template} key={i}>{template}</option>
                                })
                            }
                          </Form.Select>
                        </Col>
                      </Row>
                      : (customerDetail.name === 'cpcMessageDisplayLocation') ?
                        <Form.Select name={customerDetail.name} value={customerDetail.value} onChange={e => changeChannelDetailsHandle(e, 'value')}>
                          <option value="top">top</option>
                          <option value="bottom">bottom</option>
                        </Form.Select>
                        : (customerDetail.name === 'customerClass') ?
                          <Form.Select name={customerDetail.name} value={customerDetail.value} onChange={e => changeChannelDetailsHandle(e, 'value')}>
                            <option value="business">business</option>
                            <option value="residential">residential</option>
                          </Form.Select>
                          : <Form.Control
                            type="text"
                            onChange={e => changeChannelDetailsHandle(e, 'value')}
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
    </Row>
  );
};

ChannelDetails.propTypes = {
  handleChannelData: PropTypes.func,
  channelData: PropTypes.any,
  template: PropTypes.string,
  setTemplate: PropTypes.func
};

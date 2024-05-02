import React, { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';


import { Environment } from './Environment';
import { ChannelDetails } from './ChannelDetails';
import { CustomerDetails } from './CustomerDetails';
import { Config } from './Config';
import { AgentDetails } from './AgentDetails';
import PropTypes from 'prop-types';

export const ChannelData = (props: any) => {
  const { setChannelData, channelData, setJumpUrls, setEnvDetails, envDetails } = props;
  const handleChannelData = (type: string, value: any) => {
    let data = { ...channelData, [type]: value }
    setChannelData(data);
  }
  const [env, setEnv] = useState(envDetails.env)
  const [version, setVersion] = useState(envDetails.version);
  const [template, setTemplate] = useState(envDetails.template);

  const buildUrl = () => {
    const envId = env === "local" ? "local"
      : env === "development" ? "dev"
        : env === "preproduction" ? "preprod"
          : env === "integration" ? "int"
            : "prod";
    const baseUrl =
      envId === "local"
        ? "http://localhost:8081"
        : envId === "prod"
          ? `https://common-payment.xfinity.com/${version}/jump`
          : `https://common-payment.${envId}.xfinity.com/${version}/jump`;
    setJumpUrls([
      {
        name: 'native-shim',
        value: baseUrl + "/native-shim.js"
      }, {
        name: 'jump-web-component-bundle',
        value: baseUrl + "/jump-web-component-bundle.js"
      }
    ]);
    setEnvDetails({ ...envDetails, env: env, version: version, template: template })
  }

  useEffect(() => {
    setTemplate(template)
    buildUrl();
  }, [env, version, template])
  return <React.Fragment>
    {/* <Environment setEnv={setEnv} env={env} setVersion={setVersion} version={version} />
    <hr />
    <ChannelDetails channelData={channelData} handleChannelData={handleChannelData} template={template} setTemplate={setTemplate} />
    <hr />
    <CustomerDetails channelData={channelData} handleChannelData={handleChannelData} />
    <hr />
    <Config channelData={channelData} handleChannelData={handleChannelData} envDetails={envDetails} />
    <hr />
    <AgentDetails channelData={channelData} handleChannelData={handleChannelData} /> */}

    <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Environment</Accordion.Header>
        <Accordion.Body>
          <Environment setEnv={setEnv} env={env} setVersion={setVersion} version={version} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Channel Details</Accordion.Header>
        <Accordion.Body>
          <ChannelDetails channelData={channelData} handleChannelData={handleChannelData} template={template} setTemplate={setTemplate} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Customer Details</Accordion.Header>
        <Accordion.Body>
          <CustomerDetails channelData={channelData} handleChannelData={handleChannelData} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Config</Accordion.Header>
        <Accordion.Body>
          <Config channelData={channelData} handleChannelData={handleChannelData} envDetails={envDetails} />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>Agent Details</Accordion.Header>
        <Accordion.Body>
          <AgentDetails channelData={channelData} handleChannelData={handleChannelData} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

  </React.Fragment >
};

ChannelData.propTypes = {
  setChannelData: PropTypes.func,
  channelData: PropTypes.any,
  setJumpUrls: PropTypes.func,
  jumpUrls: PropTypes.array,
  envDetails: PropTypes.object,
  setEnvDetails: PropTypes.func
};

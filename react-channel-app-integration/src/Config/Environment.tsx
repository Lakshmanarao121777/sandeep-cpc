import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Environment = (props: any) => {
  const { setEnv, env, version, setVersion } = props;
  const setEnvironmentData = (type: string, value: string) => {
    if (type === 'version') {
      setVersion(value)
    }
    if (type === 'env') {
      setEnv(value)
    }
  }
  return <Row>
    <Col sm="6">
      <Form.Select onChange={e => setEnvironmentData('env', e.target.value)} value={env}>
        <option value="local">local</option>
        <option value="development">development</option>
        <option value="integration">integration</option>
        <option value="preproduction">preproduction</option>
        <option value="production">production</option>
      </Form.Select>
    </Col>
    <Col sm="6">
      <Form.Select onChange={e => setEnvironmentData('version', e.target.value)} value={version} disabled={env === 'local' ? true : false} >
        <option value="2.3.2">2.3.2</option>
        <option value="2.3.1">2.3.1</option>
        <option value="2.3.0">2.3.0</option>
        <option value="2.2.0">2.2.0</option>
        <option value="2.0.0">2.0.0</option>
        <option value="1.1.0">1.1.0</option>
        <option value="1.0.3">1.0.3</option>
        <option value="1.0.0">1.0.0</option>
      </Form.Select>
    </Col>
  </Row >;
};

Environment.propTypes = {
  setVersion: PropTypes.func,
  setEnv: PropTypes.func,
  env: PropTypes.string,
  version: PropTypes.string
};

export { Environment };
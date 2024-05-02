import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { isPropertyValid } from './utils';
import { IGuard } from './IGuard';


export const Config = (props: any) => {
  const { handleChannelData, channelData, envDetails } = props
  const [configs, setConfigs] = useState([
    {
      name: 'displaySetDefault',
      value: channelData.config.displaySetDefault,
      disabled: !isPropertyValid(channelData.config.displaySetDefault)
    },
    {
      name: 'displayAutoPayEnroll',
      value: channelData.config.displayAutoPayEnroll,
      disabled: !isPropertyValid(channelData.config.displayAutoPayEnroll)
    },
    {
      name: 'displayStoredPaymentOption',
      value: channelData.config.displayStoredPaymentOption,
      disabled: !isPropertyValid(channelData.config.displayStoredPaymentOption)
    },
    {
      name: 'enableDarkMode',
      value: channelData.config.enableDarkMode,
      disabled: !isPropertyValid(channelData.config.enableDarkMode)
    },
    {
      name: 'enableMultipleUserSelection',
      value: channelData.config.enableMultipleUserSelection,
      disabled: !isPropertyValid(channelData.config.enableMultipleUserSelection)
    },
    // {
    //   name: 'enableIguardIntegration',
    //   value: channelData.config.iguard.enableIguardIntegration,
    //   disabled: !isPropertyValid(channelData.config.iguard.enableIguardIntegration)
    // },
    {
      name: 'enableManualEntry',
      value: channelData.config.enableManualEntry,
      disabled: !isPropertyValid(channelData.config.enableManualEntry)
    }
  ]);
  const changeConfigDisable = (e: any, type: string) => {
    let configData = configs.map((config) => {
      if (config.name === e.target.name) {
        return {
          ...config,
          [type]: (type === 'disabled' ? !config.disabled : e.target.checked)
        };
      } else {
        return config;
      }
    })
    setConfigs(configData)
    let data = configData.filter(config => {
      if (!config.disabled) {
        return config
      }
    })
    let dataFinal = {}
    data.forEach((d) => {
      dataFinal = { ...dataFinal, [d.name]: d.value === undefined ? false : d.value }
    })
    handleChannelData('config', dataFinal)
  }
  const handleIgaurd = (iguardConfig: any) => {
    let config = channelData.config;
    config.iguard = {...config.iguard, ...iguardConfig}
    handleChannelData('config', config)
  }
  return <div>
    <Row className='text-left'>
      {
        configs.map((config, key) => {
          return <Col className='col-12' key={key}>
            <Row>
              <Col sm="1" md="1">
                <Form.Check
                  onChange={e => changeConfigDisable(e, 'disabled')}
                  type="checkbox"
                  id={config.name}
                  name={config.name}
                  checked={!config.disabled}
                />
              </Col>
              <Col>
                <Form.Switch
                  onChange={e => !config.disabled ? changeConfigDisable(e, 'value') : ''}
                  disabled={config.disabled}
                  type="checkbox"
                  id={config.name}
                  label={config.name}
                  name={config.name}
                  checked={config.value}
                />
              </Col>
            </Row>
            <Row>
            </Row>
          </Col>
        })
      }
      <Col>
        <IGuard channelData={channelData} handleIgaurd={handleIgaurd} envDetails={envDetails} />
      </Col>
    </Row>
  </div>;
};

Config.propTypes = {
  handleChannelData: PropTypes.func,
  channelData: PropTypes.any,
  envDetails:PropTypes.object
};
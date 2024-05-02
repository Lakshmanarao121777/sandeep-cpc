import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isPropertyValid } from "./utils";
import { Col, Form, Row } from "react-bootstrap";
import { channelEnvironmentKeynameMapping } from "./data/channelTemplateMapping";
import { IMaping, ImappingEnv } from "./data/modal";
// type Props = {};

const IGuard = (props) => {
  const { channelData, handleIgaurd, envDetails } = props;
  //   "agentDetails": { "ntUser": "APAC\\yselva600" },
  //   "channelName": "CAFEIG"
  const [iguardConfigs, setIguardConfigs] = useState([
    {
      name: "enableIguardIntegration",
      value: channelData.config?.iguard?.enableIguardIntegration,
      disabled: !isPropertyValid(
        channelData.config?.iguard?.enableIguardIntegration
      ),
    },
    {
      name: "dontClearTags",
      value: channelData.config?.iguard?.dontClearTags,
      disabled: !isPropertyValid(channelData.config?.iguard?.dontClearTags),
    },
    {
      name: "agentDetails",
      value: channelData.config?.iguard?.agentDetails.ntUser,
      disabled: !isPropertyValid(
        channelData.config?.iguard?.agentDetails.ntUser
      ),
    },
    {
      name: "channelName",
      value: channelData.config?.iguard?.channelName,
      disabled: !isPropertyValid(channelData.config?.iguard?.channelName),
    },
    // {
    //   name: "enableIguardIntegration",
    //   value: channelData.config?.iguard?.enableIguardIntegration,
    //   disabled: !isPropertyValid(channelData.config?.iguard?.enableIguardIntegration),
    // },
  ]);
  const handleIguardData = (e, type) => {
    let iguardConfigsData = iguardConfigs.map((iguardConfig) => {
      if (iguardConfig.name === e.target.name) {
        return {
          ...iguardConfig,
          [type]:
            type === "disabled"
              ? !e.target.checked
              : iguardConfig.name === "enableIguardIntegration" ||
                iguardConfig.name === "dontClearTags"
              ? e.target.checked
              : e.target.value,
        };
      } else {
        return iguardConfig;
      }
    });
    setIguardConfigs(iguardConfigsData);
    let data = iguardConfigsData.filter((iguardConfigData) => {
      if (!iguardConfigData.disabled) {
        return iguardConfigData;
      }
    });
    let dataFinal = {};
    data.forEach((d) => {
      if (d.name === "agentDetails") {
        dataFinal = {
          ...dataFinal,
          [d.name]: d.value === undefined ? false : { ntUser: d.value },
        };
      } else {
        dataFinal = {
          ...dataFinal,
          [d.name]: d.value === undefined ? false : d.value,
        };
      }
    });
    handleIgaurd(dataFinal);
  };
  const [env, setEnv] = useState(envDetails.env || 'local')
  useEffect(()=>{
    setEnv(envDetails.env || 'local')
  },[envDetails])

  return (
    <Col sm="12" className="pl-2">
      {iguardConfigs.map((iguardConfig, i) => {
        return (
          <Row key={i}>
            <Col sm="1">
              {/* <Form.Check
                  onChange={e => changeConfigDisable(e, 'disabled')}
                  type="checkbox"
                  id={config.name}
                  name={config.name}
                  checked={!config.disabled}
                /> */}

              <Form.Check
                onChange={(e) => handleIguardData(e, "disabled")}
                type="checkbox"
                disabled={!iguardConfig.name}
                name={iguardConfig.name}
                id={iguardConfig.name}
                checked={!iguardConfig.disabled}
              />
            </Col>
            <Col>
              {iguardConfig.name === "enableIguardIntegration" ||
              iguardConfig.name === "dontClearTags" ? (
                <Form.Switch
                  onChange={(e) =>
                    !iguardConfig.disabled ? handleIguardData(e, "value") : ""
                  }
                  disabled={iguardConfig.disabled}
                  type="checkbox"
                  id={iguardConfig.name}
                  label={iguardConfig.name}
                  name={iguardConfig.name}
                  checked={iguardConfig.value}
                />
              ) : iguardConfig.name === "channelName" ? (
                <Form.Select
                  name={iguardConfig.name}
                  value={iguardConfig.value}
                  onChange={(e) => handleIguardData(e, "value")}
                >
                  {channelEnvironmentKeynameMapping &&
                    channelEnvironmentKeynameMapping[env]
                    ?.map((item) => item?.channel)
                      .filter(
                        (value, index, self) =>
                          self.indexOf(value) === index
                      )
                      .map((channel, i) => {
                        return (
                          <option value={channel} key={i}>
                            {channel}
                          </option>
                        );
                      })}
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  // label={iguardConfig.name}
                  onChange={(e) => handleIguardData(e, "value")}
                  disabled={iguardConfig.disabled}
                  value={iguardConfig.value ? iguardConfig.value : ""}
                  name={iguardConfig.name}
                />
              )}
            </Col>
          </Row>
        );
      })}
    </Col>
  );
};

IGuard.propTypes = {
  channelData: PropTypes.object,
  handleIgaurd: PropTypes.func,
  envDetails: PropTypes.object,
};

export { IGuard };

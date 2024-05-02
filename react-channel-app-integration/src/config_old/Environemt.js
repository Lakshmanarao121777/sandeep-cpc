import React from "react";

export const Environemt = (props) => {
  const { handleChange, cpcEnv, cpcEnvVersion } = props;
  return (
    <div className="row">
      <label
        className="col col-sm-3 col-form-label"
        style={{ textAlign: "left" }}
      >
        Env
      </label>
      <div className="col col-sm-5">
        <select
          onChange={(e) => handleChange(e, "env")}
          className="form-select form-select-sm"
          value={cpcEnv}
          disabled
        >
          <option value="local">local</option>
          <option value="development">development</option>
          <option value="integration">integration</option>
          <option value="preproduction">preproduction</option>
          <option value="production">production</option>
        </select>
      </div>
      {cpcEnv !== "local" && (
        <div className="col col-sm-4">
          <select
            onChange={(e) => handleChange(e, "version")}
            className="form-select form-select-sm"
            value={cpcEnvVersion}
            disabled
          >
            <option value="1.0.0">1.0.0</option>
            <option value="1.1.0">1.1.0</option>
            <option value="2.0.0">2.0.0</option>
            <option value="2.2.0">2.2.0</option>
            <option value="2.3.0">2.3.0</option>
          </select>
        </div>
      )}
    </div>
  );
};


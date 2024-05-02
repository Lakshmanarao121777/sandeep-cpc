import React from "react";

export const ChannelConfig = (props) => {
  const { title, value, handleChange, type } = props;
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckCheckedDisabled"
        name={type}
        checked={value}
        onChange={(e) => handleChange(e, "config")}
      ></input>
      <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">
        {title}
      </label>
    </div>
  );
};

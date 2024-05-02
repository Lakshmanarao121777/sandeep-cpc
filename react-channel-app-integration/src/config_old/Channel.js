import React from "react";
import { ChannelTemplateMapping } from "./ChannelTemplateMapping";

export const Channel = (props) => {
  const { handleChange, channel } = props;
  return (
    <div className="col col-sm-6">
      <select
        onChange={(e) => handleChange(e, "channel")}
        className="form-select form-select-sm"
        value={channel}
      >
        {Object.keys(ChannelTemplateMapping).map((channel, i) => {
          return (
            <option value={channel} key={i}>
              {channel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

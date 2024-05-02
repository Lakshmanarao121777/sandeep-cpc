import React from "react";
import { Channel } from "./Channel";
import { ChannelTemplateMapping } from "./ChannelTemplateMapping";

export const Template = (props) => {
  const { handleChange, cpcPageType, channel } = props;
  return (
    <div className="row">
      <Channel handleChange={handleChange} channel={channel} />
      <div className="col col-sm-6">
        <select
          onChange={(e) => handleChange(e, "template")}
          className="form-select form-select-sm"
          value={cpcPageType}
        >
          <option value="paymentTypeSelection">paymentTypeSelection</option>
          {
            ChannelTemplateMapping[channel].map((template, i)=>{
              return (<option value={template} key={i}>{template}</option>)
            })
          }
        </select>
      </div>
    </div>
  );
};

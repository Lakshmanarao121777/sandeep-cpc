import "./assets/css/iframe-loading.css"
import React, { Component } from "react";

export class IframeLoading extends Component {
    constructor(props) {
        super(props);
    }
    iframeLoading = (isIframeLoading) => {
        const loader = document.getElementById('cpc-loader');
        if (isIframeLoading && loader) {
            document.getElementById('cpc-loader').setAttribute('class', 'loader');
            return;
        }
        document.getElementById("cpc-loader")?.remove();
    }
    render() {
        return <div id="cpc-loader"></div>
    }
}
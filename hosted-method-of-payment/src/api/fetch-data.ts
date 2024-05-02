import { ErrorHandling } from '../utils/error-handling';
import { CPC_DEFAULT_ERROR_MESSAGE, EVN_CPC_ERROR } from '../constant/app.constant';
import { ErrorType, MessageType } from '../model/view.model';
import { Globals } from '../utils/globals';
import { ChannelService } from '../service/channel-service';

export class FetchData{
    private errorHandling:ErrorHandling = new ErrorHandling();
    constructor(){
        const channelService:ChannelService = new ChannelService(Globals.getInstance().appState.get('channelData'));
        this.errorHandling = new ErrorHandling(channelService);
    }
    async get(url:string) {
        let data:any = Object.assign({});
        try {
            const response = await this.fetchNetworkRequest(url);
            data = await this.parseNetworkResponse(response);
        } catch (err) {
            this.handleErrors(err);
        }
        return data;
    }
    async getErrorMessageJson(url:string) {
        let data:any = Object.assign({});
        try {
            const response = await this.fetchNetworkRequest(url);
            data = await this.parseNetworkResponse(response);      
        } catch (err) {            
            this.handleErrorsMessage(err);
        }
        return data;
    }
    async getGlobalContentJson(url:string) {
        let data:any = Object.assign({});
        try {
            const response = await this.fetchNetworkRequest(url);
            data = await this.parseNetworkResponse(response);      
        } catch (err) {            
            this.handleErrorsMessage(err);
        }
        return data;
    }
    async post(url: string, header: any, requestBody: any) {
        let data: any = Object.assign({});
        try {
            const response = await this.postNetworkRequest(url, header, requestBody);
            data = await this.parseNetworkResponse(response);
            // const ce = new CustomEvent('jump-api-response-completed', {detail: response});
            // document.dispatchEvent(ce);
        } catch (err) {
            this.handleErrors(err);
        }
        return data;
    }
    // send network request
    async fetchNetworkRequest(url: string) {
        try {
            const response = await fetch(url, {
                headers: {
                    method: 'GET',
                    'Content-Type': 'text/html',
                    accept: 'text/html',
                },
            });
            return response;
        } catch (err: any) {
            const networkError: any = err;
            networkError.isFetchError = true;
            networkError.message = `[Network Error]: ${err.message} - Could not reach ${url}`;
            throw err;
        }
    }
    async postNetworkRequest(url: string, header: any, requestBody: any) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: header,
                body: requestBody,
            });
            return response;
        } catch (err: any) {
            const networkError: any = err;
            networkError.isFetchError = true;
            networkError.message = `[Network Error]: ${err.message} - Could not reach ${url}`;
            throw err;
        }
    }
    // parse ReadableStream returned by server
    async parseNetworkResponse(response: any) {
    //always parse the ReadableStream as text
        const responseText = await response.text();
        //pass it into our helper function to get a JavaScript Object OR String depending on whether the response was JSON OR Plain-Text
        const data = this.processResponseText(responseText);
        if (!response.ok) {
            const apiError: any = new Error('[API Error]');
            apiError.isFetchError = true;
            apiError.response = response;
            apiError.data = data;
            throw apiError;
        }
        return data;
    }
    // parse mixed response types
    processResponseText(responseText: any) {
        try {
            // Attempt to parse the text as a JSON object
            return JSON.parse(responseText);
        } catch (err) {
            // Parsing response text as JSON failed, this must be a plain-text response.
            return responseText;
        }
    }
    // Function to handle errors
    handleErrorsMessage(err:any) {
        if (err.isFetchError) {
            // either a Network Error or an API Error
            if (err.response) {
                // must be an API Error since the server sent a response
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
                this.errorHandling.showError(cpcMessage, err);  
            } else {
                // must be a Network Error since the server did not send a response
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
                // cpcMessage.messageDetail = err;
                this.errorHandling.showError(cpcMessage, err);
            }
        } else if (!err.isFetchError) {
            // must be a JS Syntax Error since our custom property was not attached.
            const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
            this.errorHandling.showError(cpcMessage, err.data);
        }
    }
    // Function to handle errors
    handleErrors(err:any):void {
        if (err.isFetchError) {
            // either a Network Error or an API Error
            if (err.response) {
                // must be an API Error since the server sent a response
                this.handleAPIErrors(err);
                console.error(err, err.data);
            } else {
                // must be a Network Error since the server did not send a response
                this.handleAPIErrors(err);
                console.error(err);
            }
        } else if (!err.isFetchError) {
            // must be a JS Syntax Error since our custom property was not attached.
            this.handleAPIErrors(err);
            console.error(err);
        }
    }
    sendCPCMessage(messageDetails:string):void{ 
        const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
        this.errorHandling.showError(cpcMessage, messageDetails);
        
    }
    handleAPIErrors(err:any): void{
        if(err && err.response && ((err.response.status.toString().indexOf('40') >= 0) || (err.response.status.toString().indexOf('50') >= 0))){
            if(err.data.message){
                this.sendCPCMessage(err.data.message);
            }else{
                this.sendCPCMessage(err.data);
            }
        }else{
            this.sendCPCMessage(err.data);
        }                                
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        const global = Globals.getInstance();
        switch(key){
        case ErrorType.system:            
            errorMessage = global.getErrorMessage(ErrorType.system, subKey);
            break;
        case ErrorType.service:            
            errorMessage = global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.communication:            
            errorMessage = global.getErrorMessage(ErrorType.communication, subKey);
            break;
        }
        return errorMessage;
    }   
    
}

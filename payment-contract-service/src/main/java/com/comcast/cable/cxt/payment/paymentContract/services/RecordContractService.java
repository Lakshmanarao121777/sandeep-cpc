package com.comcast.cable.cxt.payment.paymentContract.services;

import com.comcast.cable.cxt.payment.paymentContract.config.PaymentTermsEnum;
import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractServiceConstants;
import com.comcast.cable.cxt.payment.paymentContract.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.util.*;

import static com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE;

@Component
public class RecordContractService extends ServiceClientBase {

    public static PaymentRecordContractResponse recordContractResponse(HttpHeaders headers, PaymentRecordContractRequest paymentRecordContractRequest, RestClientFactory restClientFactory, String contractManagementServiceUrl) {
        HttpHeaders requestHeader = ServiceClientBase.getCommonHttpHeaders(headers);
        RecordContractRequest recordContractRequest = getRecordContractRequest(paymentRecordContractRequest);
        PaymentRecordContractResponse paymentRecordContractResponse = new PaymentRecordContractResponse();

        HttpEntity<String> entity = new HttpEntity(recordContractRequest, requestHeader);
        String url = contractManagementServiceUrl + "/" + PaymentContractServiceConstants.RECORD_CONTRACT_API_OPERATION;

        Map<String, Object> clientParameters = new HashMap<>();
        clientParameters.put(PaymentContractServiceConstants.URL, url);
        clientParameters.put(PaymentContractServiceConstants.CLIENT_ID, PaymentContractServiceConstants.CONTRACT_MANAGEMENT_CLIENT_ID);
        clientParameters.put(PaymentContractServiceConstants.HTTP_METHOD, HttpMethod.POST);

        Map<String, String> response = callClient(restClientFactory, entity, clientParameters);
        if (response.get(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS) == PaymentContractServiceConstants.SUCCESS) {
            paymentRecordContractResponse.setCpcContractStatus(PaymentContractServiceConstants.SUCCESS);
            RecordContractResponse recordContractResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), RecordContractResponse.class);
            paymentRecordContractResponse.setRecordedContractSummary(recordContractResponse.getRecordedContractSummary().get(0));
        } else if (response.get(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS) == PaymentContractServiceConstants.ERROR) {
            paymentRecordContractResponse.setCpcContractStatus(PaymentContractServiceConstants.ERROR);
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.setMessage(response.get(CLIENT_RESPONSE_MESSAGE));
            paymentRecordContractResponse.setContractErrorDetails(errorDetails);
        } else if (response.get(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS) == PaymentContractServiceConstants.HTTP_ERROR) {
            paymentRecordContractResponse.setCpcContractStatus(PaymentContractServiceConstants.ERROR);
            ErrorDetails errorDetails = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorDetails.class);
            paymentRecordContractResponse.setContractErrorDetails(errorDetails);
        }

        return paymentRecordContractResponse;
    }

    static RecordContractRequest getRecordContractRequest(PaymentRecordContractRequest paymentRecordContractRequest) {

        RecordContractRequest recordContractRequest = new RecordContractRequest();

        ContractSpecification contractSpecification = new ContractSpecification();
        if (paymentRecordContractRequest.getChannel() != null && paymentRecordContractRequest.getTermsType() != null && !paymentRecordContractRequest.getChannel().isBlank() && !paymentRecordContractRequest.getTermsType().isBlank()) {
            contractSpecification.setTermID(PaymentTermsEnum.getTermIdForChannel(paymentRecordContractRequest.getChannel(), paymentRecordContractRequest.getTermsType()));
        }
        recordContractRequest.setContractSpecification(new ArrayList<>(List.of(contractSpecification)));

        CustomerIdentifier customerIdentifier = new CustomerIdentifier();
        if (paymentRecordContractRequest.getAccountNumber() != null && !paymentRecordContractRequest.getAccountNumber().isBlank()) {
            customerIdentifier.setKey(PaymentContractServiceConstants.ACCOUNT_NUMBER);
            customerIdentifier.setValue(paymentRecordContractRequest.getAccountNumber());
        }
        if (paymentRecordContractRequest.getCustomerGuid() != null && !paymentRecordContractRequest.getCustomerGuid().isBlank()) {
            customerIdentifier.setKey(PaymentContractServiceConstants.IDENTITY_ID);
            customerIdentifier.setValue(paymentRecordContractRequest.getCustomerGuid());
        }
        recordContractRequest.setCustomerIdentifier(customerIdentifier);

        return recordContractRequest;
    }
}

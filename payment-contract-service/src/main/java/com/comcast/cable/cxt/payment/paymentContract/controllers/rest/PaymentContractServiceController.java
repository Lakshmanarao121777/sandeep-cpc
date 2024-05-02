package com.comcast.cable.cxt.payment.paymentContract.controllers.rest;

import com.comcast.cable.cxt.payment.paymentContract.config.PaymentContractServiceConfig;
import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractService;
import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractServiceConstants;
import com.comcast.cable.cxt.payment.paymentContract.services.RecordContractService;
import com.comcast.cable.cxt.payment.paymentContract.vo.PaymentRecordContractRequest;
import com.comcast.cable.cxt.payment.paymentContract.vo.PaymentRecordContractResponse;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
public class PaymentContractServiceController {

    private static final String RECORD_CONTRACT_REQUEST_PATH = "/api/v1/PaymentContractService/recordContract";
    private final PaymentContractServiceConfig config;
    @Autowired
    RecordContractService recordContractService;
    @Value("${restclient.def.contractmanagement.endpoint}")
    String contractManagementServiceUrl;
    @Resource(name = "factory.restClient")
    private RestClientFactory restClientFactory;

    @Autowired
    public PaymentContractServiceController(PaymentContractServiceConfig config) {
        this.config = config;
    }

    @RequestMapping(name = "PaymentContractService", method = {RequestMethod.POST}, value = RECORD_CONTRACT_REQUEST_PATH, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
   // @PreAuthorize("#oauth2.hasScope('xsp:payment:contract')")
    public ResponseEntity<PaymentRecordContractResponse> recordContract(@RequestHeader HttpHeaders headers, @RequestBody PaymentRecordContractRequest paymentRecordContractRequest) {

        PaymentRecordContractResponse paymentRecordContractResponse = RecordContractService.recordContractResponse(headers, paymentRecordContractRequest, restClientFactory, contractManagementServiceUrl);
        HttpStatus httpStatus = HttpStatus.OK;
        return ResponseEntity.status(httpStatus).body(paymentRecordContractResponse);
    }


    @RequestMapping(method = {RequestMethod.GET}, value = "/PaymentContractService/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaymentContractService> paymentContractService(@PathVariable String id) {
        return new ResponseEntity<PaymentContractService>(new PaymentContractService(id), HttpStatus.OK);
    }

    @RequestMapping(method = {RequestMethod.GET}, value = "/api/v1/PaymentContractService/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaymentContractService> paymentContractServiceSecure(@PathVariable String id) {
        return new ResponseEntity<PaymentContractService>(new PaymentContractService(id), HttpStatus.OK);
    }


    @RequestMapping(value = "/", produces = "application/json")
    public Map<String, String> index() {
        return new HashMap<String, String>() {
            private static final long serialVersionUID = -7006213790932083398L;

            {
                put("message", "Service Name - " + config.getServiceName());
                put("date", new java.util.Date().toString());
            }
        };
    }
}

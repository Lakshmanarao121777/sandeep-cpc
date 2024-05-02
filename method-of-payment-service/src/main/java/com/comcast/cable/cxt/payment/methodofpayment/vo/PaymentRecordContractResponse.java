package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRecordContractResponse {
    private String cpcContractStatus;
    private RecordedContractSummary recordedContractSummary;
    private ErrorDetails contractErrorDetails;

}

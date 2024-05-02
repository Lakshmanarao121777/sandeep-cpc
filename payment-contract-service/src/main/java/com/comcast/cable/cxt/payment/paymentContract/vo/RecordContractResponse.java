package com.comcast.cable.cxt.payment.paymentContract.vo;

import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
@Getter
@Setter
public class RecordContractResponse {
    private String docusignEnvelopeID;
    private String docusignURL;
    private ArrayList<RecordedContractSummary> recordedContractSummary;
}

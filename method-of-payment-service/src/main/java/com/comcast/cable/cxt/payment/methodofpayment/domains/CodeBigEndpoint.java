package com.comcast.cable.cxt.payment.methodofpayment.domains;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Custom actuator endpoint to return codebig.txt for the application.
 */
@Component
@Endpoint(id="codebig.txt")
public class CodeBigEndpoint {

    @Value("${service.name:undefined}")
    private String codeBigServiceName;

    @Value("${service.environment:undefined}")
    private String codeBigServiceEnvironment;

    @ReadOperation
    public String codebigtxt() {
        return getCodebigTxtString();
    }


    private  String getCodebigTxtString() {
        List<String> environmentList = Arrays.asList(codeBigServiceEnvironment.split(","));
        String serviceNames= "";
        if(environmentList.size() > 1){
          for(String environment: environmentList){
              serviceNames= serviceNames + "service: " + codeBigServiceName + "-" + environment + "\n";
          }

        }else{
            serviceNames= "service: " + codeBigServiceName + "-" + codeBigServiceEnvironment;
        }
        return serviceNames;
    }

}

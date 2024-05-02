package com.comcast.cable.cxt.payment.paymentContract.controllers.rest;

import com.comcast.xsp.connector.core.rest.RestClient;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.comcast.xsp.core.util.exception.ServiceException;
import com.comcast.xsp.service.core.config.ServiceConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Endpoints used to check if the xsp-gradle-test plugins are working correctly.
 */
@RestController("testFlightcheckController")
public class TestFlightCheckController extends BaseRestApiControllerConfig {

    public static final String FLIGHTCHECK_APPPROPS = "propertyOrg";
    public static final String FLIGHTCHECK_FUNCTIONAL_PROPOVERRIDE = "Goku";
    public static final String FLIGHTCHECK_CONTRACT_PROPOVERRIDE = "GhostNappa";
    private static final Logger LOG = LoggerFactory.getLogger(TestFlightCheckController.class);
    @Resource(name = "xsp.service.Configuration")
    private ServiceConfiguration serviceConfiguration;

    @Resource(name = "factory.restClient")
    private RestClientFactory restClientFactory;

    @RequestMapping(value = "/flightcheck/propertysources", produces = "application/json")
    public Map<String, String> functionalPropSourceCheck() {
        String fcVal = this.serviceConfiguration.getString("xsp.test.flightcheck.appprops");

        Map<String, String> flightCheckMap = new HashMap<>();
        flightCheckMap.put("applicationProperties", fcVal);

        return flightCheckMap;
    }

    @RequestMapping(value = "/flightcheck/functional/propoveride", produces = "application/json")
    public Map<String, String> functionalPropOverride() {
        String fcVal = this.serviceConfiguration.getString("xsp.test.flightcheck.overridevalue");

        Map<String, String> flightCheckMap = new HashMap<>();
        flightCheckMap.put("propertyOverride", fcVal);

        return flightCheckMap;
    }

    @PostMapping(value = "/flightcheck/functional/logVerification")
    public String serviceAppContextLogVerificationCheck() {
        LOG.info("LogVerificationTest_info");
        try {
            throw new ServiceException("ExceptionLogVerification");
        } catch (Exception ex) {
            LOG.error("ExceptionLogVerificationEntry", ex);
        }
        return "Logs sent";
    }

    @RequestMapping(value = "/flightcheck/contract/propoveride", produces = "application/json")
    public Map<String, String> contractPropOverride() {
        String fcVal = this.serviceConfiguration.getString("xsp.test.flightcheck.overridevalue");

        Map<String, String> flightCheckMap = new HashMap<>();
        flightCheckMap.put("propertyOverride", fcVal);

        return flightCheckMap;
    }

    @RequestMapping(value = "/flightcheck/contract/mococheck", produces = "application/json")
    public Map<String, String> contractMocoCheck() {
        final String mocoEndpoint = this.serviceConfiguration.getString("moco.endpoint.contractmococheck.url");
        RestClient client = this.restClientFactory.getClient("contractmococheck");
        return client.getForObject(mocoEndpoint, HashMap.class);
    }
}

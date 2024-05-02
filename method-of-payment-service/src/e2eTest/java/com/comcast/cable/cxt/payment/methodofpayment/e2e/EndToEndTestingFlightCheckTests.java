package com.comcast.cable.cxt.payment.methodofpayment.e2e;

import com.comcast.xsp.test.core.config.ServiceTestConfiguration;
import com.comcast.xsp.test.core.service.RestAssuredAssistant;
import com.comcast.xsp.test.setup.E2eTestAdapter;
import com.comcast.xsp.test.setup.E2eTestConfiguration;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    classes = {E2eTestConfiguration.class}
)
public class EndToEndTestingFlightCheckTests extends E2eTestAdapter {

    @Resource(name = "xsp.test.RestAssuredAssistant")
    private RestAssuredAssistant restAssuredAssistant;

    @Resource(name = "xsp.test.service.Configuration")
    private ServiceTestConfiguration serviceConfig;

    @Test
    public void shouldCheckServiceCodeLoadsApplicationProperties() {
        Response response = restAssuredAssistant.initialize()
            .addOauthToken()
            .shouldLogAll()
            .construct()
            .get("/api/flightcheck/propertysources")
            .then()
            .assertThat().statusCode(HttpStatus.SC_OK)
            .extract().response();

        String appPropWorks = response.getBody().jsonPath().getString("applicationProperties");
        assertThat(appPropWorks).isEqualTo("AYBABTU");
    }

    @Test
    public void shouldCheckE2ePropsOverrideApplicationProperties() throws Exception {
        Response response = restAssuredAssistant.initialize()
            .addOauthToken()
            .shouldLogAll()
            .construct()
            .get("/api/flightcheck/contract/propoveride")
            .then()
            .assertThat().statusCode(HttpStatus.SC_OK)
            .extract().response();

        String appPropWorks = response.getBody().jsonPath().getString("propertyOverride");
        assertThat(appPropWorks).isEqualTo("Vegeta");
    }

    @Test
    public void shouldHaveAccessToE2eTestPropsFromTestContext() throws Exception {
        assertThat(this.serviceConfig.getString("xsp.test.flightcheck.testctxvalue")).isEqualTo("Janemba");
    }

    @Test
    public void shouldHaveLoadedSpringProfiles() {
        List<String> activeProfiles = this.serviceConfig.getActiveProfileList();
        System.out.println("Active profiles: "+String.join(",",activeProfiles));
    }

    @Test
    public void shouldLoadSpringEnvironmentSpecificProps() throws Exception {
        String envPropValue = this.serviceConfig.getString("xsp.test.e2e.env-test");
        List<String> profiles = this.serviceConfig.getActiveProfileList();
        if(profiles.contains("dev")) {
            assertThat(envPropValue).isEqualTo("development");
        } else if(profiles.contains("qa")) {
            assertThat(envPropValue).isEqualTo("quality-assurance");
        } else if(profiles.contains("int")) {
            assertThat(envPropValue).isEqualTo("integrations");
        } else if(profiles.contains("wc-r1")) {
            assertThat(envPropValue).isEqualTo("westchester-red1");
        } else {
            assertThat(envPropValue).isEqualTo("fubar");
        }
    }

}

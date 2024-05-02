package com.comcast.xsp.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * The configuration server application class.
 * Created by hkrish001c on 4/03/15.
 */
@Configuration
@EnableAutoConfiguration
@EnableConfigServer
@EnableWebSecurity
@ComponentScan({
        "com.comcast.xsp"
})
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }

}

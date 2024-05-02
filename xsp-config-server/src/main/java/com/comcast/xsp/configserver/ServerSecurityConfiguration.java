package com.comcast.xsp.configserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Setup up security for the configuration server such that certain actuator endpoints do not require authentication.
 */
@EnableWebSecurity
@Configuration
public class ServerSecurityConfiguration extends WebSecurityConfigurerAdapter {
    
    @Autowired
    private Environment environment;
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .requestMatchers(EndpointRequest.to("info","health","initialized")).permitAll()
                .requestMatchers(EndpointRequest.toAnyEndpoint()).authenticated()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                .anyRequest().authenticated()
                .and().formLogin()
                .and().httpBasic();
    }

}

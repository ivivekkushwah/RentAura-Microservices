package com.rentaura.maintenanceservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MaintenanceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaintenanceServiceApplication.class, args);
    }

}

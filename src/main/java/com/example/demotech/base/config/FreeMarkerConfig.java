package com.example.demotech.base.config;

import freemarker.template.TemplateExceptionHandler;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FreeMarkerConfig {

    @Bean
    @Qualifier("customFreeMarkerConfig")
    public freemarker.template.Configuration freemarkerConfiguration() {
        freemarker.template.Configuration config = new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_32);
        config.setClassForTemplateLoading(this.getClass(), "/templates/");
        config.setDefaultEncoding("UTF-8");
        config.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        return config;
    }
}



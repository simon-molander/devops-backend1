package org.example.javabackend1;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Service
public class CustomerServiceClient {
    private final RestClient restClient;

    public CustomerServiceClient(@Value("${customer.service.url}") String apiURL) {
        this.restClient = RestClient.builder().baseUrl(apiURL).build();
    }

    public boolean customerExists(long id) {
        try {
            this.restClient.get().uri("/api/customers/{id}", id).retrieve().toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound exception) {
            return false;
        }
    }
}

package org.example.javabackend1;

import org.example.javabackend1.Room.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.client.EntityExchangeResult;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
public class RoomTest {
    @Autowired
    private RestTestClient restTestClient;

    @Autowired
    private RoomRepository roomRepository;

    @Test
    public void createRoom_returns201_savesToDB() {
        RoomCreateDTO createDTO = new RoomCreateDTO(RoomType.SINGLE, 0);

        EntityExchangeResult<RoomResponseDTO> responseExchangeResult = restTestClient.post().uri("/api/rooms")
                .body(createDTO)
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody(RoomResponseDTO.class)
                .returnResult();

        assertThat(responseExchangeResult.getResponseBody()).isNotNull();
        long roomId = responseExchangeResult.getResponseBody().getId();

        RoomEntity room = roomRepository.findById(roomId).get();

        assertThat(room.getRoomType()).isEqualTo(RoomType.SINGLE);
        assertThat(room.getExtraBeds()).isEqualTo(0);
    }

    @Test
    public void invalidCreateData_returns400() {
        RoomCreateDTO createDTO = new RoomCreateDTO(RoomType.SINGLE, 1);

        restTestClient.post().uri("/api/rooms")
                .body(createDTO)
                .exchange()
                .expectStatus()
                .isBadRequest();
    }

    @Test
    public void deleteRoom_returns204_deletesFromDB() {
        RoomCreateDTO createDTO = new RoomCreateDTO(RoomType.SINGLE, 0);

        EntityExchangeResult<RoomResponseDTO> responseExchangeResult = restTestClient.post().uri("/api/rooms")
                .body(createDTO)
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody(RoomResponseDTO.class)
                .returnResult();

        assertThat(responseExchangeResult.getResponseBody()).isNotNull();
        long roomId = responseExchangeResult.getResponseBody().getId();

        restTestClient.delete().uri("/api/rooms/" + roomId)
                .exchange()
                .expectStatus()
                .isNoContent();

        Optional<RoomEntity> room = roomRepository.findById(roomId);
        assertThat(room).isEmpty();
    }
}

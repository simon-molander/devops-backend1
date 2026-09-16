package org.example.javabackend1.Room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomCreateDTO {
    @NotNull
    private RoomType roomType;

    @Min(0)
    @NotNull
    private int extraBeds;
}

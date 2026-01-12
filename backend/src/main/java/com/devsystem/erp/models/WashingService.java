package com.devsystem.erp.models;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor

public class WashingService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Field: Time of washing  (mm/ dd/ yyyy in your ID)
    private LocalDate date;

    //Field: Type of vehicle (Select Dropdown)
    @ManyToOne
    @JoinColumn(name =  "vehicle_type_id")
    private VehicleType vehicleType;

    //Field: Minutes of washing
    private Integer washingMinutes;

    // ---Columns calculates for report (Snapshot)
    // ---We saved this here for the "Export Excel" were fast and not recalculate

    private Double waterUsed; //Water (L)
    private Double disinfectantUsed; // Disinfectant (L)
    private Double degreaserUsed; // Degreaser (L)
    private Double bleachUsed; // Bleach (L)
}

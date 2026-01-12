package com.devsystem.erp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "supply_consumptions")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SupplyConsumption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @ManyToOne
    @JoinColumn(name = "supply_id", nullable = false)
    private Supply supply;
    private Double quantity;
    private String unit;

}

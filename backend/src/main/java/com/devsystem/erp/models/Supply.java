package com.devsystem.erp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "supplies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Supply {

    @Id
    private String sku;
    private String name;
    private double costPerUnit;
    private String unit;

    //New field: Necessary  for Dashboard
    // This field we saved the value that see in the circle blue

    private Double currentQuantity;
}

package com.devsystem.erp.controllers;
import com.devsystem.erp.models.VehicleType;
import com.devsystem.erp.repositories.VehicleTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@CrossOrigin(origins = "*")
public class VehicleTypeController {
    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @GetMapping
    public List<VehicleType> getAllVehicleType(){
        return vehicleTypeRepository.findAll();
    }
}

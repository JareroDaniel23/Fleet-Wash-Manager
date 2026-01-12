package com.devsystem.erp.controllers;

import com.devsystem.erp.models.Supply;
import com.devsystem.erp.models.SupplyConsumption;
import com.devsystem.erp.models.WashingService;
import com.devsystem.erp.repositories.SupplyConsumptionRepository;
import com.devsystem.erp.repositories.SupplyRepository;
import com.devsystem.erp.repositories.WashingServiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/washing-services")
@CrossOrigin(origins = "*")
public class WashingServiceController {

    @Autowired
    private WashingServiceRepository washingServiceRepository;

    @Autowired
    private SupplyConsumptionRepository supplyConsumptionRepository;

    @Autowired
    private SupplyRepository supplyRepository;

    @GetMapping
    public List<WashingService> getAllService() {
        return washingServiceRepository.findAll();
    }

    @PostMapping
    @Transactional
    public WashingService createService(@RequestBody WashingService newService) {


        if (newService.getVehicleType() == null || newService.getVehicleType().getId() == null) {
            throw new RuntimeException("The type of vehicle is mandatory");
        }

        Long vehicleTypeId = newService.getVehicleType().getId();
        List<SupplyConsumption> recipe = supplyConsumptionRepository.findByVehicleType_Id(vehicleTypeId);

        double totalDisinfectant = 0;
        double totalDegreaser = 0;
        double totalBleach = 0;

        for (SupplyConsumption consumption : recipe) {
            Supply supplyInStock = consumption.getSupply();

            Double amountInMilliliters = consumption.getQuantity();

            double amountInLiters = amountInMilliliters / 1000;

            double currentQty = supplyInStock.getCurrentQuantity() != null ? supplyInStock.getCurrentQuantity() : 0.0;

            double newQty = Math.max(0, currentQty - amountInLiters);

            supplyInStock.setCurrentQuantity(newQty);
            supplyRepository.save(supplyInStock);

            String name = supplyInStock.getName().toLowerCase();

            if (name.contains("disinfectant") || name.contains("Disinfectant")) {
                totalDisinfectant += amountInMilliliters;
            } else if (name.contains("degreaser") || name.contains("Degreaser")) {
                totalDegreaser += amountInMilliliters;
            } else if (name.contains("bleach") || name.contains("Bleach")) {
                totalBleach += amountInMilliliters;
            }
        }

        newService.setDisinfectantUsed(totalDisinfectant);
        newService.setDegreaserUsed(totalDegreaser);
        newService.setBleachUsed(totalBleach);

        double waterAmount = 0.0;

        if (newService.getWashingMinutes() != null && newService.getWashingMinutes() > 0) {
            waterAmount = newService.getWashingMinutes() * 10.0;
        }

        newService.setWaterUsed(waterAmount);

        return washingServiceRepository.save(newService);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteService(@PathVariable Long id) {
        WashingService serviceToDelete = washingServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        if (serviceToDelete.getVehicleType() != null) {
            Long vehicleTypeId = serviceToDelete.getVehicleType().getId();
            List<SupplyConsumption> recipe = supplyConsumptionRepository.findByVehicleType_Id(vehicleTypeId);

            for (SupplyConsumption consumption : recipe) {

                Supply supplyInStock = consumption.getSupply();

                Double amountInMilliliters = consumption.getQuantity();

                double amountInLiters = amountInMilliliters / 1000.0;

                double currentQty = supplyInStock.getCurrentQuantity() != null ? supplyInStock.getCurrentQuantity() : 0.0;

                supplyInStock.setCurrentQuantity(currentQty + amountInLiters);
                supplyRepository.save(supplyInStock);
            }
        }
        washingServiceRepository.delete(serviceToDelete);
    }

    @DeleteMapping
    public void deleteAllServices() {
        washingServiceRepository.deleteAll();
    }
}
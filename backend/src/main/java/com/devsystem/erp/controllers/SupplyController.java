package com.devsystem.erp.controllers;

import com.devsystem.erp.models.Supply;
import com.devsystem.erp.repositories.SupplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplies")
@CrossOrigin(origins = "*")
public class SupplyController {

    @Autowired
    private SupplyRepository supplyRepository;

    @GetMapping
    public List<Supply> getAllSupplies() {
        return supplyRepository.findAll();
    }

    @PostMapping("/restock")
    public Supply restockSupply(@RequestBody Supply incoming) {
        if (incoming.getName() == null) {
            throw new RuntimeException("El nombre del suministro es obligatorio");
        }

        Optional<Supply> existingOpt = supplyRepository.findByNameIgnoreCase(incoming.getName());

        if (existingOpt.isPresent()) {
            Supply existing = existingOpt.get();
            double current = existing.getCurrentQuantity() != null ? existing.getCurrentQuantity() : 0.0;
            double added = incoming.getCurrentQuantity() != null ? incoming.getCurrentQuantity() : 0.0;

            existing.setCurrentQuantity(current + added);
            return supplyRepository.save(existing);

        } else {

            if (incoming.getSku() == null || incoming.getSku().isEmpty()) {
                String generatedSku = incoming.getName().toUpperCase().trim().replace(" ", "_");
                if (generatedSku.length() > 10) generatedSku = generatedSku.substring(0, 10);
                incoming.setSku(generatedSku + "-001");
            }

            return supplyRepository.save(incoming);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> resetInventory() {
        List<Supply> allSupplies = supplyRepository.findAll();
        for (Supply supply : allSupplies) {
            supply.setCurrentQuantity(0.0);
        }
        supplyRepository.saveAll(allSupplies);
        return ResponseEntity.ok("Inventario reseteado a 0.");
    }
}
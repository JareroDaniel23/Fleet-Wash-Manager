package com.devsystem.erp;

import com.devsystem.erp.models.*;
import com.devsystem.erp.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner{
    private final SupplyRepository supplyRepo;
    private final VehicleTypeRepository vehicleTypeRepo;
    private final SupplyConsumptionRepository consumptionRepo;
    private final WashingServiceRepository washingServiceRepository;
    private final SealLogRepository sealLogRepository;

    private Supply degreaser;
    private Supply disinfectant;
    private Supply bleach;

    public DataSeeder (SupplyRepository supplyRepo,
                       VehicleTypeRepository vehicleTypeRepo,
                       SupplyConsumptionRepository consumptionRepo,
                       WashingServiceRepository washingServiceRepository,
                       SealLogRepository sealLogRepository){
        this.supplyRepo = supplyRepo;
        this.vehicleTypeRepo = vehicleTypeRepo;
        this.consumptionRepo = consumptionRepo;
        this.washingServiceRepository = washingServiceRepository;
        this.sealLogRepository = sealLogRepository;
    }

    @Override
    public void run(String... args) {

       /* if(sealLogRepository.count() == 0 ){
            sealLogRepository.save(SealLog.builder()
                    .date(LocalDate.now())
                    .driverName("Carlos 'El Rápido' G.")
                    .vehicleType("Trailer Caja Seca")
                    .washerName("Equipo B")
                    .licensePlate("PDF-2023")
                    .initialStrap("00991")
                    .finalStrap("00992")
                    .build());
        }*/

        if(supplyRepo.count() == 0 ){
            System.out.println("Seeding Chemicals...");

            supplyRepo.save(new Supply("CHEM-DEG", "Degreaser", 0.0, "mL",0.0));
            supplyRepo.save(new Supply("CHEM-DES", "Disinfectant", 0.0, "mL",0.0));
            supplyRepo.save(new Supply("CHEM-", "Bleach", 0.0, "mL",0.0));
        }

        this.degreaser =  supplyRepo.findAll().stream().filter(s -> s.getName().equals("Degreaser")).findFirst().orElse(null);
        this.disinfectant = supplyRepo.findAll().stream().filter(s -> s.getName().equals("Disinfectant")).findFirst().orElse(null);
        this.bleach =  supplyRepo.findAll().stream().filter(s -> s.getName().equals("Bleach")).findFirst().orElse(null);

        if (vehicleTypeRepo.count() == 0){
            createRecipe("Torton_Cage", 1000.0, 750.0, 0.0);

            // Torton Cage 3-Floors Dirty
            createRecipe("Torton_Cage_3-Floors_Dirty", 1000.0, 0.0, 0.0);

            // Pick-Up
            createRecipe("Pick-Up", 0.0, 100.0, 0.0);

            // Car
            createRecipe("Car", 0.0, 100.0, 0.0);

            // Pick-up 3-Tons with Load
            createRecipe("Pick-up_3Tons_with_load", 0.0, 300.0, 0.0);

            // Pick-Up 3-Tons with Trailer
            createRecipe("Pick-Up_3Tons_with_trailer", 400.0, 400.0, 0.0);

            // Water Tanker
            createRecipe("Water_Tanker", 400.0, 400.0, 0.0);

            // Gas Tanker
            createRecipe("Gas_Tanker", 300.0, 350.0, 0.0);

            // Pressure Washer Hose
            createRecipe("Pressure_Washer_Hose", 50.0, 50.0, 0.0);

            // Crane / Tow Truck
            createRecipe("Crane", 400.0, 400.0, 0.0);

            // Pick-Up 3-Tons Low Bed
            createRecipe("Pick-Up_3Tons_with_low_bed", 400.0, 400.0, 0.0);

            // Agave Truck
            createRecipe("Agave_Torton", 500.0, 500.0, 0.0);

            // Drill Truck
            createRecipe("Drill_Truck", 500.0, 500.0, 0.0);

            // Torton Cage Whitening
            createRecipe("Torton_Cage_Whitening", 0.0, 1000.0, 1500.0);

            // Trailer Cage
            createRecipe("Trailer-Cage", 1700.0, 1700.0, 0.0);

            // Trailer Cage Dirty
            createRecipe("Trailer-Cage_Dirty", 2000.0, 1700.0, 0.0);

            // Trailer Cage Whitening
            createRecipe("Trailer-Cage_Whitening", 0.0, 1700.0, 2000.0);

            // Trailer Livestock 3-Floors Deep Whitening
            createRecipe("Livestock_Trailer-3-Floors_Deep_Whitening", 0.0, 2000.0, 4500.0);

            // Trailer Cage Deep Whitening
            createRecipe("Trailer-Cage_Deep_Whitening", 0.0, 1700.0, 4000.0);

            // Torton Cage Deep Whitening
            createRecipe("Torton-Cage_Deep_Whitening", 0.0, 1700.0, 2500.0);

            // Trailer Livestock 2-Floors Deep Whitening
            createRecipe("Livestock_Trailer-2-Floors_Deep_Whitening", 0.0, 2000.0, 2000.0);

            // Trailer with Backhoe
            createRecipe("Trailer_With_Backhoe", 1000.0, 1000.0, 0.0);

            // Trailer with Bulldozer
            createRecipe("Trailer_With_Bulldozer", 1200.0, 1200.0, 0.0);

            // Backhoe
            createRecipe("Backhoe", 750.0, 750.0, 0.0);

            // Trailer Full
            createRecipe("Trailer_Full", 1500.0, 1500.0, 0.0);

            // Torton Cage 2-Floors
            createRecipe("Torton-Cage_2_floors", 800.0, 1000.0, 0.0);

            // Torton Cage 2-Floors Dirty
            createRecipe("Torton-Cage_2_floors_dirty", 1000.0, 1000.0, 0.0);

            // Pick-Up 3-Tons 2-Floors
            createRecipe("Pick-Up_3Tons_2_floors", 400.0, 400.0, 0.0);

            // Trailer Livestock 3-Floors
            createRecipe("Livestock_Trailer_3_floors", 2000.0, 2000.0, 0.0);

            // Trailer Livestock 2-Floors
            createRecipe("Livestock_Trailer_2_floors", 1700.0, 1700.0, 0.0);

            // Trailer Livestock 3-Floors Whitening
            createRecipe("Livestock_Trailer_3_floors_Whitening", 0.0, 2000.0, 2000.0);

            // Trailer Livestock 2-Floors Whitening
            createRecipe("Livestock_Trailer_2_floors_Whitening", 0.0, 2000.0, 2000.0);

            // Pick-Up Closed Box
            createRecipe("Pick-Up_Closed_Box", 400.0, 400.0, 0.0);

            // Trailer Payloader
            createRecipe("Trailer-Payloader", 750.0, 750.0, 0.0);

            // Trailer Mini Backhoe
            createRecipe("Trailer-Mini_Backhoe", 250.0, 250.0, 0.0);
        }

        /*if(washingServiceRepository.count() == 0){
            VehicleType carType = vehicleTypeRepo.findAll().stream()
                    .filter(v -> v.getName().equals("Car")).findFirst().orElse(null);

            if (carType != null){
                WashingService washing1 = WashingService.builder()
                        .date(java.time.LocalDate.now())
                        .vehicleType(carType)
                        .washingMinutes(45)
                        .waterUsed(100.0)
                        .disinfectantUsed(50.0)
                        .degreaserUsed(45.0)
                        .bleachUsed(0.0)
                        .build();

                washingServiceRepository.save(washing1);
                System.out.println("Washing Service Test Data Created!");
            }
        }*/
    }


    private void createRecipe(String vehicleName, Double degreaserQty, Double disinfectantQty , Double bleachQty){
        VehicleType v = vehicleTypeRepo.save(new VehicleType(null, vehicleName, ""));

        if (degreaserQty > 0 && degreaser != null) {
            consumptionRepo.save(new SupplyConsumption(null, v, degreaser, degreaserQty, "mL"));
        }

        if (disinfectantQty > 0 && disinfectant != null) {
            consumptionRepo.save(new SupplyConsumption(null, v, disinfectant, disinfectantQty, "mL"));
        }

        if (bleachQty > 0 && bleach != null) {
            consumptionRepo.save(new SupplyConsumption(null, v, bleach, bleachQty, "mL"));
        }
    }
}

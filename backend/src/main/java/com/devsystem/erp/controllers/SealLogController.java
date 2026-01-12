package com.devsystem.erp.controllers;

import com.devsystem.erp.models.SealLog;
import com.devsystem.erp.repositories.SealLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seal-logs")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.OPTIONS})
public class SealLogController {

    @Autowired
    private SealLogRepository sealLogRepository;

    @GetMapping
    public List<SealLog> getAllLogs() {
        return sealLogRepository.findAll();
    }


    @PostMapping
    public SealLog createLog(@RequestBody SealLog newLog) {
        return sealLogRepository.save(newLog);
    }

    @DeleteMapping
    public void deleteAllLogs(){
        sealLogRepository.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deleteLogId(@PathVariable Long id){
        sealLogRepository.deleteById(id);
    }
}
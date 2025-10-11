package com.bills_manager.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bills_manager.api.model.Bill;
import com.bills_manager.api.service.BillService;

@RestController
@RequestMapping("/bills")
public class BillController {
    
    private final BillService billService;

    BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAll() {
        return ResponseEntity.ok(billService.getAll());
    }

    @PostMapping
    public ResponseEntity<Bill> create(@RequestBody Bill bill) {
        return ResponseEntity.status(HttpStatus.CREATED).body(billService.create(bill));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getById(@PathVariable int id) {
        Bill bill = billService.getBillById(id);

        if (bill == null) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(billService.getBillById(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        billService.deleteBill(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Bill> edit(@PathVariable int id, @RequestBody Bill bill) {
        Bill updatedBill = billService.getBillById(id);

        if (updatedBill == null) {
            ResponseEntity.notFound().build();
        }

        billService.editBill(id, bill);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}/paid")
    public ResponseEntity<Void> editPaidStatus(@PathVariable int id){
        billService.editBillPaidStatus(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}

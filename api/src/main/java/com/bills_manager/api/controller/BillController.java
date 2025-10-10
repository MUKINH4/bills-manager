package com.bills_manager.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bills_manager.api.model.Bill;
import com.bills_manager.api.service.BillService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/bills")
public class BillController {
    
    private final BillService billService;

    BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAll();
    }

    @PostMapping
    public Bill create(@RequestBody Bill bill) {
        return billService.create(bill);
    }
    
    

}

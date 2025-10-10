package com.bills_manager.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bills_manager.api.model.Bill;
import com.bills_manager.api.repository.BillRepository;

@Service
public class BillService {
    private final BillRepository billRepository;

    BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public Bill create(Bill bill) {
        return billRepository.save(bill);
    }

    public List<Bill> getAll() {
        return billRepository.findAll();
    }
}

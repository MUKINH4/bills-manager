package com.bills_manager.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bills_manager.api.model.Bill;
import com.bills_manager.api.repository.BillRepository;

import jakarta.persistence.EntityNotFoundException;

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

    public Bill getBillById(int id) {
        return billRepository.findById(id).orElseThrow(() ->
            new EntityNotFoundException("ID não encontrado")
        );
    }

    public void deleteBill(int id) {
        Bill bill = getBillById(id);
        billRepository.delete(bill);
    }

    public Bill editBill(int id, Bill bill) {
        Bill existingBill = getBillById(id);
        if (existingBill == null) {
            throw new EntityNotFoundException("ID não encontrado");
        }
        existingBill.setAmount(bill.getAmount());
        existingBill.setBillName(bill.getBillName());
        existingBill.setCategory(bill.getCategory());
        existingBill.setDueDate(bill.getDueDate());
        existingBill.setPaid(bill.isPaid());

        return billRepository.save(existingBill);
    }

    public void editBillPaidStatus(int id){
        Bill bill = getBillById(id);
        if (bill == null) {
            throw new EntityNotFoundException("ID não encontrado");
        }

        bill.setPaid(!bill.isPaid());
        billRepository.save(bill);
    }
}

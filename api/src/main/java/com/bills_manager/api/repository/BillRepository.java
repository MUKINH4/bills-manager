package com.bills_manager.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bills_manager.api.model.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer>
{}

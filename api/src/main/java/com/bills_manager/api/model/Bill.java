package com.bills_manager.api.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Bill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String billName;

    private double amount;

    private String receiver;

    private LocalDate dueDate;

    private boolean paid;
}

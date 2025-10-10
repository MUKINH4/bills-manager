package com.bills_manager.api.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "bill")
public class Bill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String billName;

    private double amount;

    private String receiver;

    private LocalDate dueDate;

    private boolean paid;

    private String category;
}

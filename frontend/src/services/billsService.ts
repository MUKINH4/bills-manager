import type { Bill } from "../types/Bill";

const API_URL = "http://localhost:8080"

export const getBills = async (): Promise<Bill[]> => {
    try {
        const response = await fetch(`${API_URL}/bills`, {
        method: "GET"   
        })
        console.log(response);
        const data = await response.json();
        console.log(data);
        return data as Bill[];
    } catch(e) {
        console.error(e);
        return [];
    }   
} 

export const addBill = async (bill: Bill): Promise<Bill> => {
    try {
        const response = await fetch(`${API_URL}/bills`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bill)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bill added successfully:", data);
        return data as Bill;
    } catch(e) {
        console.error("Error adding bill:", e);
        throw e; // Re-throw para que o componente possa tratar o erro
    }
}

export const updateBillPaidStatus = async (billId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/bills/${billId}/paid`, {
            method: "PUT",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Bill status updated successfully:", response);
        return response.ok;
    } catch(e) {
        console.error("Error updating bill status:", e);
        throw e;
    }
}

export const deleteBill = async (billId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/bills/${billId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Bill deleted successfully");
    } catch(e) {
        console.error("Error deleting bill:", e);
        throw e;
    }
}
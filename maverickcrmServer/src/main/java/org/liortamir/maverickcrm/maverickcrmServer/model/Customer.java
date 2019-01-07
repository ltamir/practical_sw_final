package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Customer {

	private int customerId;
	private String customerName;
	private String customerNotes;
	
	public Customer(int customerId, String customerName, String customerNotes) {
		this.customerId = customerId;
		this.customerName = customerName;
		this.customerNotes = customerNotes;
	}
	public int getCustomerId() {
		return customerId;
	}
	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerNotes() {
		return customerNotes;
	}
	public void setCustomerNotes(String customerNotes) {
		this.customerNotes = customerNotes;
	}
	
	
}

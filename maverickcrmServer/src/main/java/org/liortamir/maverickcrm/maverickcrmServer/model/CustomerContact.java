package org.liortamir.maverickcrm.maverickcrmServer.model;

public class CustomerContact {

	private int customerContactId;
	private Customer customer;
	private Contact contact;
	private ContactType contactType;
	
	public CustomerContact(int customerContactId, Customer customer, Contact contact, ContactType contactType) {
		this.customerContactId = customerContactId;
		this.customer = customer;
		this.contact = contact;
		this.contactType = contactType;
	}
	
	public int getCustomerContactId() {
		return customerContactId;
	}
	
	public void setCustomerContactId(int customerContactId) {
		this.customerContactId = customerContactId;
	}
	public Customer getCustomer() {
		return customer;
	}
	public void setCustomer(Customer customer) {
		this.customer = customer;
	}
	public Contact getContact() {
		return contact;
	}
	public void setContact(Contact contact) {
		this.contact = contact;
	}
	public ContactType getContactType() {
		return contactType;
	}
	public void setContactType(ContactType contactType) {
		this.contactType = contactType;
	}
	
	
}

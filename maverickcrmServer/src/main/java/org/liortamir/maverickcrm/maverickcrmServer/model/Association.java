package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Association {

	private int associationId;
	private Customer customer;
	private Contact contact;
	private Address address;
	private ContactType contactType;
	
	public Association(int associationId, Customer customer, Contact contact, Address address, ContactType contactType) {
		this.associationId = associationId;
		this.customer = customer;
		this.contact = contact;
		this.address = address;
		this.contactType = contactType;
	}
	
	public int getAssociationId() {
		return associationId;
	}
	
	public void setAssociationId(int associationId) {
		this.associationId = associationId;
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
	
	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public ContactType getContactType() {
		return contactType;
	}
	public void setContactType(ContactType contactType) {
		this.contactType = contactType;
	}
	
	
}

package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Contact {

	private int contactId;
	private String firstName;
	private String lastName;
	private String officePhone;
	private String mobilePhone;
	private String email;
	private String notes;
	
	public Contact() {
		
	}
	
	public Contact(int contactId, String firstName, String lastName, String officePhone, String mobilePhone, String email,
			String notes) {
		super();
		this.contactId = contactId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.officePhone = officePhone;
		this.mobilePhone = mobilePhone;
		this.email = email;
		this.notes = notes;
	}

	public int getContactId() {
		return contactId;
	}

	public void setContactId(int contactId) {
		this.contactId = contactId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getOfficePhone() {
		return officePhone;
	}

	public void setOfficePhone(String officePhone) {
		this.officePhone = officePhone;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String cellPhone) {
		this.mobilePhone = cellPhone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
	
	@Override
	public String toString() {
		return getFirstName() + " " + getLastName();
	}
	
}

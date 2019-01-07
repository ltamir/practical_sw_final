package org.liortamir.maverickcrm.maverickcrmServer.model;

/**
 * Depicts the association type between a contact and a customer<br>
 * in CustomerContacts
 * @author liort
 *
 */
public class ContactType {

	private int contactTypeId;
	private String contactTypeName;
	
	
	public ContactType(int contactTypeId, String contactTypeName) {
		this.contactTypeId = contactTypeId;
		this.contactTypeName = contactTypeName;
	}
	
	public int getContactTypeId() {
		return contactTypeId;
	}
	public void setContactTypeId(int contactTypeId) {
		this.contactTypeId = contactTypeId;
	}
	public String getContactTypeName() {
		return contactTypeName;
	}
	public void setContactTypeName(String contactTypeName) {
		this.contactTypeName = contactTypeName;
	}
	
	
}

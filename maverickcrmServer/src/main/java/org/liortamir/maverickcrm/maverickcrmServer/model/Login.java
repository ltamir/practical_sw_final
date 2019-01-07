package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Login {

	private int loginId;
	private String username;
	private String password;
	private Contact contactId;
	public Login(int userId, String userName, String password, Contact contactId) {
		super();
		this.loginId = userId;
		this.username = userName;
		this.password = password;
		this.contactId = contactId;
	}
	
	public Login(int userId, String userName, Contact contactId) {
		super();
		this.loginId = userId;
		this.username = userName;
		this.contactId = contactId;
	}
	
	public int getLoginId() {
		return loginId;
	}
	public void setLoginId(int userId) {
		this.loginId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String userName) {
		this.username = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Contact getContactId() {
		return contactId;
	}
	public void setContactId(Contact contactId) {
		this.contactId = contactId;
	}
	
	
}

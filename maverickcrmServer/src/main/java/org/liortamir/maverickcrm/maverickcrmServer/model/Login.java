package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Login {

	private int loginId;
	private String username;
	private String password;
	private Contact contact;
	
	public Login(int userId, String userName, String password, Contact contact) {
		this.loginId = userId;
		this.username = userName;
		this.password = password;
		this.contact = contact;
	}
	
	public Login(int userId, String userName, Contact contact) {
		this.loginId = userId;
		this.username = userName;
		this.contact = contact;
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
	public Contact getContact() {
		return contact;
	}
	public void setContact(Contact contact) {
		this.contact = contact;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Login)
			return ((Login)obj).getLoginId() == getLoginId();
		return false;
	}

	@Override
	public int hashCode() {
		return getLoginId();
	}
	
	
}

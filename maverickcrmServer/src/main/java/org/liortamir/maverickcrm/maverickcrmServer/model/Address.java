package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Address {

	private int addressId;
	private String street;
	private String houseNum;
	private String city;
	private String country;
	
	public Address(int addressId, String street, String houseNum, String city, String country) {
		super();
		this.addressId = addressId;
		this.street = street;
		this.houseNum = houseNum;
		this.city = city;
		this.country = country;
	}
	
	public int getAddressId() {
		return addressId;
	}
	public void setAddressId(int addressId) {
		this.addressId = addressId;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getHouseNum() {
		return houseNum;
	}
	public void setHouseNum(String houseNum) {
		this.houseNum = houseNum;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	
}

package org.liortamir.maverickcrm.maverickcrmServer.model;

public class PermissionType {

	private int permissionTypeId;
	private String permissionTypeName;
	
	public PermissionType(int permissionTypeId, String permissionTypeName) {
		super();
		this.permissionTypeId = permissionTypeId;
		this.permissionTypeName = permissionTypeName;
	}
	public int getPermissionTypeId() {
		return permissionTypeId;
	}
	public void setPermissionTypeId(int permissionTypeId) {
		this.permissionTypeId = permissionTypeId;
	}
	public String getPermissionTypeName() {
		return permissionTypeName;
	}
	public void setPermissionTypeName(String permissionTypeName) {
		this.permissionTypeName = permissionTypeName;
	}
	
	
}

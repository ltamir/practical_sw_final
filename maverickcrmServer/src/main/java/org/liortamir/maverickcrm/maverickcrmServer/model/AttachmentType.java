package org.liortamir.maverickcrm.maverickcrmServer.model;

public class AttachmentType {

	private int attachmentTypeId;
	private String attachmentTypeName;
	
	public AttachmentType(int attachmentTypeId, String attachmentTypeName) {
		this.attachmentTypeId = attachmentTypeId;
		this.attachmentTypeName = attachmentTypeName;
	}
	public int getAttachmentTypeId() {
		return attachmentTypeId;
	}
	public void setAttachmentTypeId(int attachmentTypeId) {
		this.attachmentTypeId = attachmentTypeId;
	}
	public String getAttachmentTypeName() {
		return attachmentTypeName;
	}
	public void setAttachmentTypeName(String attachmentTypeName) {
		this.attachmentTypeName = attachmentTypeName;
	}
	
	
}

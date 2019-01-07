package org.liortamir.maverickcrm.maverickcrmServer.model;

public class Attachment {

	private int attachmentId;
	private AttachmentType attachmentType;
	private TaskLog taskLog;
	private String fileName;
	private String storageFileName;
	private String storageFilePath;
	
	public Attachment(int attachmentId, AttachmentType attachmentType, TaskLog taskLog, String fileName,
			String storageFileName, String storageFilePath) {
		this.attachmentId = attachmentId;
		this.attachmentType = attachmentType;
		this.taskLog = taskLog;
		this.fileName = fileName;
		this.storageFileName = storageFileName;
		this.storageFilePath = storageFilePath;
	}
	
	public int getAttachmentId() {
		return attachmentId;
	}
	public void setAttachmentId(int attachmentId) {
		this.attachmentId = attachmentId;
	}
	public AttachmentType getAttachmentType() {
		return attachmentType;
	}
	public void setAttachmentType(AttachmentType attachmentType) {
		this.attachmentType = attachmentType;
	}
	public TaskLog getTaskLog() {
		return taskLog;
	}
	public void setTaskLog(TaskLog taskLog) {
		this.taskLog = taskLog;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getStorageFileName() {
		return storageFileName;
	}
	public void setStorageFileName(String storageFileName) {
		this.storageFileName = storageFileName;
	}
	public String getStorageFilePath() {
		return storageFilePath;
	}
	public void setStorageFilePath(String storageFilePath) {
		this.storageFilePath = storageFilePath;
	}
	
	
	
	
}

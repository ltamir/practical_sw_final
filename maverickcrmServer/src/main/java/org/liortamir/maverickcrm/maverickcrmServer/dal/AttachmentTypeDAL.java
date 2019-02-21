package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.AttachmentType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class AttachmentTypeDAL {

	private static final AttachmentTypeDAL instance = new AttachmentTypeDAL();
	private List<AttachmentType> cacheList = null;
	
	private AttachmentTypeDAL() {
		loadCache();
	}
	
	public static AttachmentTypeDAL getInstance() {
		return instance;
	}
	
	public void loadCache(){
		try{
			this.cacheList = get();
		}catch(SQLException | IndexOutOfBoundsException e){
			System.out.println("Error loading AttachmentTypeDAL chache: " + e.toString());
		}
	}
	
	public AttachmentType get(int attachmentTypeId) throws SQLException {
		AttachmentType entity = this.cacheList.get(attachmentTypeId-1);
		if(entity != null) return entity;	
		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from attachmentType where attachmentTypeId=?");
			stmt.setInt(1, attachmentTypeId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<AttachmentType> getAll() throws SQLException {
		return this.cacheList;
	}
	
	public List<AttachmentType> get() throws SQLException {
		List<AttachmentType> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from attachmentType order by attachmentTypeId");
			ResultSet rs = stmt.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private AttachmentType mapFields(ResultSet rs) {
		AttachmentType attachmentType = null;
		try{
			attachmentType = new AttachmentType(rs.getInt("attachmentTypeId"), rs.getString("attachmentTypeName"));
		}catch(SQLException e) {
			return attachmentType;
		}
		return attachmentType;
	}
}

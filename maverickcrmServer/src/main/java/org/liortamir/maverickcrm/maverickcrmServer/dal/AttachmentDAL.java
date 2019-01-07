package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Attachment;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class AttachmentDAL {

	private static final AttachmentDAL instance = new AttachmentDAL();
	
	private AttachmentDAL() {}
	
	public static AttachmentDAL getInstance() {
		return instance;
	}
	
	public Attachment get(int attachmentId) throws SQLException {
		Attachment entity = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from attachment where attachmentId=?");
			stmt.setInt(1, attachmentId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Attachment> getAll() throws SQLException {
		List<Attachment> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement ps = conn.prepareStatement("select * from attachment");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Attachment> getByTask(int taskId) throws SQLException {
		List<Attachment> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from attachment where taskLogId in (select taskLogId from taskLog where taskId=?)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public int insert(int attachmentTypeId, int taskLogId, String fileName, String storageFileName, String storageFilePath) throws SQLException{
		int rowId=0;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into attachment values(Default,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, attachmentTypeId);
			ps.setInt(2, taskLogId);
			ps.setString(3, fileName);
			ps.setString(4, storageFileName);
			ps.setString(5, storageFilePath);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error in insert into attachment");
			ResultSet rs = ps.getGeneratedKeys();
			while(rs.next())
				rowId = rs.getInt(1);
		}
		return rowId;
	}
	
	public void update(int attachmentId, int attachmentTypeId) throws SQLException{
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update attachment set attachmentTypeId=? where attachmentId=?");
			ps.setInt(1, attachmentTypeId);
			ps.setInt(2, attachmentId);
			
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error in update attachment");			
		}
	}
	
	private Attachment mapFields(ResultSet rs) throws SQLException{
		Attachment attachment = null;
	
		attachment = new Attachment(
				rs.getInt("attachmentId"), 
				AttachmentTypeDAL.getInstance().get(rs.getInt("attachmentTypeId")),
				TaskLogDAL.getInstance().get(rs.getInt("taskLogId")),
				rs.getString("fileName"),
				rs.getString("storageFileName"),
				rs.getString("storageFilePath"));

		return attachment;
	}
}

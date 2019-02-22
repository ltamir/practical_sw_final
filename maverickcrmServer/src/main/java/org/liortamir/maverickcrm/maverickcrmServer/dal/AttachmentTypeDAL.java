package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.AttachmentType;

public class AttachmentTypeDAL extends AbstractDAL<AttachmentType>{

	private static final AttachmentTypeDAL instance = new AttachmentTypeDAL();
	
	private AttachmentTypeDAL() {
		loadCache();
	}
	
	public static AttachmentTypeDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from attachmentType where attachmentTypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from attachmentType order by attachmentTypeId");
	}
	
	@Override
	protected AttachmentType mapFields(ResultSet rs) {
		AttachmentType attachmentType = null;
		try{
			attachmentType = new AttachmentType(rs.getInt("attachmentTypeId"), rs.getString("attachmentTypeName"));
		}catch(SQLException e) {
			return attachmentType;
		}
		return attachmentType;
	}
}

package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Status;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class StatusDAL {

	private static final StatusDAL instance = new StatusDAL();
	
	private StatusDAL() {}
	
	public static StatusDAL getInstance() {
		return instance;
	}
	
	public Status get(int statusId) throws SQLException {
		Status entity = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from status where statusId=?");
			stmt.setInt(1, statusId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Status> getAll() throws SQLException {
		List<Status> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement stmt = conn.prepareStatement("select * from status");
			ResultSet rs = stmt.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private Status mapFields(ResultSet rs) throws SQLException{
		Status status = null;
		status = new Status(rs.getInt("statusId"), rs.getString("statusName"));

		return status;
	}
}

package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.Status;

public class StatusDAL extends AbstractDAL<Status>{

	private static final StatusDAL instance = new StatusDAL();
	
	private StatusDAL() {
		loadCache();
	}
	
	public static StatusDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from status where statusId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from status order by statusId");
	}
	
	
	@Override
	protected Status mapFields(ResultSet rs) throws SQLException{
		Status status = null;
		status = new Status(rs.getInt("statusId"), rs.getString("statusName"));

		return status;
	}

}

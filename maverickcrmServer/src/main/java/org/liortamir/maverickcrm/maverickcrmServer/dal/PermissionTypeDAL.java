package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.PermissionType;

public class PermissionTypeDAL extends AbstractDAL<PermissionType>{

	private static final PermissionTypeDAL instance = new PermissionTypeDAL();
	
	private PermissionTypeDAL() {}
	
	public static PermissionTypeDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from permissiontype where permissiontypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from permissiontype order by permissiontypeId");
	}
	
	
	@Override
	protected PermissionType mapFields(ResultSet rs)throws SQLException {
		PermissionType permissionType = null;
		permissionType = new PermissionType(rs.getInt("permissionTypeId"), rs.getString("permissionName"));

		return permissionType;
	}
}

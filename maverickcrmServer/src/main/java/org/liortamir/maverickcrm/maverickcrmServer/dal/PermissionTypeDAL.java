package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.PermissionType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class PermissionTypeDAL {

	private static final PermissionTypeDAL instance = new PermissionTypeDAL();
	private List<PermissionType> cacheList = null;
	
	private PermissionTypeDAL() {
		loadCache();
	}
	
	public static PermissionTypeDAL getInstance() {
		return instance;
	}
	
	public void loadCache(){
		try{
			this.cacheList = get();
		}catch(SQLException | IndexOutOfBoundsException e){
			System.out.println("Error loading PermissionTypeDAL chache: " + e.toString());
		}
	}
	
	public PermissionType get(int permissiontypeId) throws SQLException {
		PermissionType entity = this.cacheList.get(permissiontypeId-1);
		if(entity != null) return entity;	

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from permissiontype where permissiontypeId=?");
			ps.setInt(1, permissiontypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<PermissionType> getAll() throws SQLException {
		return this.cacheList;
	}
	
	public List<PermissionType> get() throws SQLException {
		List<PermissionType> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from permissiontype");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private PermissionType mapFields(ResultSet rs)throws SQLException {
		PermissionType permissionType = null;
		permissionType = new PermissionType(rs.getInt("permissionTypeId"), rs.getString("permissionName"));

		return permissionType;
	}
}

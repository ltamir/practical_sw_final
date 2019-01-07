package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class LoginDAL {
	private static LoginDAL instance = new LoginDAL();
	
	private LoginDAL() {}
	
	public static LoginDAL getInstance() {
		return instance;
	}
	
	public Login get(int loginId) throws SQLException {
		Login entity = null;

		try( Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskType where taskTypeId=?");
			ps.setInt(1, loginId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Login> getAll() throws SQLException{
		List<Login> loginList = null;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from login");
			ResultSet rs = ps.executeQuery();
			loginList = new ArrayList<>(10);
			while(rs.next())
				loginList.add(mapFields(rs));
		}
		return loginList;
	}
	
	private Login mapFields(ResultSet rs) throws SQLException{
		Login login = null;
		login = new Login(rs.getInt("loginId"), rs.getString("username"), rs.getString("password"),ContactDAL.getInstance().get(rs.getInt("contactId")));

		return login;
	}
}

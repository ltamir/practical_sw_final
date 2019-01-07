package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class LoginDAL {
	public static Login get(int loginId) throws SQLException {
		Login entity = null;
		Connection conn = null;
		try {
			conn = DBHandler.getConnection();
			PreparedStatement stmt = conn.prepareStatement("select * from taskType where taskTypeId=?");
			stmt.setInt(1, loginId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}catch(SQLException e) {
			return entity;
		}finally {
			conn.close();
		}
		return entity;
	}
	
	private static Login mapFields(ResultSet rs) {
		Login login = null;
		try{
			login = new Login(rs.getInt("loginId"), rs.getString("username"), null);
		}catch(SQLException e) {
			return login;
		}
		return login;
	}
}

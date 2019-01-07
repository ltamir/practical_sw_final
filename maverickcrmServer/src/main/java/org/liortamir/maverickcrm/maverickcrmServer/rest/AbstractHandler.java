package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

import com.google.gson.Gson;

public abstract class AbstractHandler extends HttpServlet {

	protected Gson jsonHelper = new Gson();
	
	protected ActionEnum getAction(HttpServletRequest req) {
		ActionEnum action = ActionEnum.ACT_NONE;
		
		String strAction = req.getParameter("action");
		try {
			int actionId = Integer.parseInt(strAction);
			action = ActionEnum.values()[actionId];
		}catch(NumberFormatException w) {
			System.out.println("invalid action id");
		}
		return action;
	}
		
	protected void handleDB() {
		try {
			Connection conn = DBHandler.getConnection();
		}catch(SQLException e) {
			
		}
	}
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
			

			ActionEnum action = getAction(req);
			
		
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doPost(req, resp);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doPut(req, resp);
	}

	
}

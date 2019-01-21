package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.DatabaseDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.DatabaseRow;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class DatabaseController extends HttpServlet {

	private static final long serialVersionUID = -3340984536477397627L;
	Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		JsonObject json = new JsonObject();;
		
		try {
			
			String sql = req.getParameter("sql");
			List<DatabaseRow> bulk = DatabaseDAL.getInstance().executeSQL(sql);
			json.add("array", jsonHelper.toJsonTree(bulk));
			json.addProperty("status",  "ack");
			response = jsonHelper.toJson(json);

		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("err",  e.toString());
			json.addProperty("msg",  e.toString());
			json.addProperty("status",  "nack");
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);
	}	
	
}

package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.AttachmentDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskLogDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;
import org.liortamir.maverickcrm.maverickcrmServer.model.Attachment;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "Attachment", urlPatterns="/attachment")
@MultipartConfig(fileSizeThreshold = 1024 * 1024,
  maxFileSize = 1024 * 1024 * 5, 
  maxRequestSize = 1024 * 1024 * 5 * 5)
public class AttachmentController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;

	private Gson jsonHelper = new Gson();
	private SimpleDateFormat frm=  new SimpleDateFormat();
	private String storagePath;
	private Reference ref = Reference.getInstance();
	private AttachmentDAL dal = AttachmentDAL.getInstance();
	private final String REF_PREFIX = "attachment";
	private final static int FETCH_SIZE = 128;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Attachment attachment = null;
		int attachmentId;
		JsonObject json = new JsonObject();;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			switch(action){
			case GET_ALL:
				int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				List<Attachment> bulk = dal.getByTask(taskId);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case GET_SINGLE:
				attachmentId = Integer.parseInt(req.getParameter(APIConst.FLD_ATTACHMENT_ID));
				attachment = dal.get(attachmentId);
				json.add("attachment", jsonHelper.toJsonTree(attachment));				
				break;
			case GET_ATTACHMENT:
				attachmentId = Integer.parseInt(req.getParameter(APIConst.FLD_ATTACHMENT_ID));
				attachment = dal.get(attachmentId);
				resp.setContentType("application/zip");
				resp.setHeader("Content-disposition", "attachment; filename=" + attachment.getStorageFileName());
				File attachmentFile = new File(attachment.getStorageFilePath().substring(2) + attachment.getStorageFileName());

				try(InputStream in = new FileInputStream(attachmentFile);
					OutputStream out = resp.getOutputStream()) {
					byte[] buffer = new byte[FETCH_SIZE];

					int numBytesRead;
					while ((numBytesRead = in.read(buffer)) > 0) {
						out.write(buffer, 0, numBytesRead);
					}
				}
				return;
			default:
				break;
			}

			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException | NullPointerException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = ServletHelper.toJson(jsonHelper, json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		try {
			int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
			int taskLogId = 0;
			int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_CONTACT_ID));
			final int taskLogTypeId = 3;
			String description = req.getParameter(APIConst.FLD_ATTACHMENT_WEB_NOTES);
			int attachmentTypeId = Integer.parseInt(req.getParameter(APIConst.FLD_ATTACHMENT_ATTACHMENT_TYPE_ID));
			String fileName = null;
			String storageFileName = null;

			Part filePart = req.getPart("attachmentFile");
			fileName = filePart.getSubmittedFileName();
			
			int fileNumber = 0;
			for(File existingFile = new File(storagePath + fileName + "_" + fileNumber + ".zip"); existingFile.exists(); fileNumber++, existingFile = new File(storagePath + fileName + "_" + fileNumber + ".zip"));
			
			storageFileName = fileName + "_" + fileNumber + ".zip";
			
			File uploadedFile = new File(storagePath + storageFileName);
			try(ZipOutputStream out = new ZipOutputStream(new FileOutputStream(uploadedFile))){
				ZipEntry e = new ZipEntry(fileName);
				out.putNextEntry(e);
				byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
				out.write(bytes, 0, bytes.length);
				out.closeEntry();		
			}

			taskLogId = TaskLogDAL.getInstance().insert(frm.format(new Date()), taskId, contactId, description, taskLogTypeId);
			int attachmentId = dal.insert(attachmentTypeId, taskLogId, fileName, storageFileName, storagePath);
			json.addProperty("taskLogId", taskLogId);
			json.addProperty("attachmentId", attachmentId);
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException  | NullPointerException | SQLException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty("attachmentId", "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter responseOut = resp.getWriter();
		responseOut.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		int attachmentTypeId = 0;	
		int attachmentId = 0;
		int attachmentTaskLogId = 0;
		int contactId = 0;
		String attachmentNotes = null;
		
		try {
	
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_ATTACHMENT_ATTACHMENT_TYPE_ID:
						attachmentTypeId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_CONTACT_ID:
						contactId = Integer.parseInt(item.getString());
						break;						
					case APIConst.FLD_ATTACHMENT_ID:
						attachmentId = Integer.parseInt(item.getString());
						break;	
					case APIConst.FLD_TASKLOG_ID:
						attachmentTaskLogId = Integer.parseInt(item.getString());
						break;	
					case APIConst.FLD_ATTACHMENT_WEB_NOTES:
						attachmentNotes = item.getString();
						break;						
						default:
							System.out.println("CustomerHandler.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}	
			
			dal.update(attachmentId, attachmentTypeId);	
			TaskLogDAL.getInstance().update(attachmentTaskLogId, attachmentNotes, contactId);
			json.addProperty("attachmentId", attachmentId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | FileUploadException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty("attachmentId", 0);
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	public void init() throws ServletException {
		super.init();
		frm.applyPattern("yyyy-MM-dd HH:mm:ss");
		storagePath = ref.getAsString(REF_PREFIX + ".fileStorage");
		if(storagePath == null)
			throw new ServletException("Invalid fileStoragein configuration");
	}
}

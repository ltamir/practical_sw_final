package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class Reference {
private Map<String, String> referenceMap = new HashMap<String, String>();
	
	private static Reference reference = new Reference();
	
	
	// ***** singletone & constructor ***** // 
	
	public static Reference getInstance(){
		return Reference.reference;
	}
	
	private Reference(){
		readConfig();
		
	}
	
	
	// ***** read configuraiton files ***** //
	
	private void readConfig(){
		File[] files = new File("./data").listFiles();
					
		if(files == null){
			System.out.println("error reading files");
			System.exit(0);
		}else{
			System.out.println("Listing files:");
			for(File configFile : files){
				System.out.println(configFile.getName());
			}
		}	
		
		
		// iterate over all config files under config directory
		for(File configFile : files){
			Properties prop = new Properties();
			
			// TODO call readConfig with the directory as str param to iterate over all sub dirs in recursion
			
			// handle XML files
			if(configFile.getName().toUpperCase().endsWith("XML")){
				this.referenceMap.put(configFile.getName(), configFile.getAbsolutePath());
				continue;
			}
			if(!configFile.getName().toUpperCase().endsWith("CONFIG")){
				continue;
			}
			// handle config files (param=value struct)
			try{
				prop.load(new FileInputStream(configFile));	
			}catch(FileNotFoundException e){
				e.printStackTrace();
			}catch (IOException e){
				e.printStackTrace();
			}
			
			// read each key value pair into the reference Map
			for(String key : prop.stringPropertyNames()){
				this.referenceMap.put(key, prop.getProperty(key));
			}
		}
	}
	
	
	// ***** configuration getters ***** //
	
	public String getAsString(String name){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return value;
		else{
			System.out.println("ERROR: Parameter: " + name + " does not exist");
			return null;
		}
	}

	public String getAsString(String name, String defaultValue){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return value;
		else
			return defaultValue;
	}
	
	public Integer getAsInt(String name){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return Integer.valueOf(value);
		else
			return null;
	}
	
	public Integer getAsInt(String name, Integer defaultValue){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return Integer.valueOf(value);
		else
			return defaultValue;
	}
	
	public Boolean getAsBool(String name){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return Boolean.valueOf(value);
		else
			return null;
	}	
	
	public Boolean getAsBool(String name, Boolean defaultValue){
		String value = null;
		value = this.referenceMap.get(name);
		if(value != null)
			return Boolean.valueOf(value);
		else
			return defaultValue;
	}	

}

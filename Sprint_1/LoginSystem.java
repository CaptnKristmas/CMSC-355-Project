import java.util.Scanner;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

public class LoginSystem {
	//Class to store the types of user information.
	static class User {
		String username;
		Integer id; //null if not required
		String password;
		String type;
		
		User(String username, Integer id, String password, String type) {
			this.username = username;
			this.id = id;
			this.password = password;
			this.type = type.toLowerCase();
		}
	}
	
	//Hashmap to store credentials as Username -> User
	private static Map<String, User> users = new HashMap<>();
	
	/*
	 * Method for authenticating Username and Password and ID.
	 * Also checks if ID is necessary using requiresID.
	 * Can be modified for better authentication later
	 */
	private static boolean authenticate(String username, Integer inputID, String password) {
		if (users.containsKey(username)) {
			User user = users.get(username);
			
			if (requiresID(user.type)) {
				if (user.id == null || !user.id.equals(inputID)) return false;
			}
			
			return user.password.equals(password);
		}
		return false;
	}
	
	/*
	 * Method checks if ID is required.
	*/
	private static boolean requiresID(String userType) {
		return userType.equals("doc") || userType.equals("patient");
	}
	
	/*
	 * Loads the credentials from a file.
	 * This file stores the creds as different possibilities listed below.
	 */
	public static void loadCreds(String file) {
		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line;
			while ((line = reader.readLine()) != null) {
				String[] parts = line.split(":");
				if (parts.length == 4) {
					//Format type:username:password
					String type = parts[0].trim();
					String username = parts[1].trim();
					int id = Integer.parseInt(parts[2].trim());
					String password = parts[3].trim();
					users.put(username, new User(username, id, password, type));
				} else if (parts.length == 3) {
					//Format type:username:password
					String type = parts[0].trim();
					String username = parts[1].trim();
					String password = parts[2].trim();
					users.put(username, new User(username, null, password, type));
				} else {
					System.out.println("Error in Database Formatting on User: " + line);
				}
			}
		} catch (IOException | NumberFormatException e) {
			System.out.println("Error Reading File: " + e.getMessage()); 
		}
	}
	
	public static void main(String[] args) {
		//We can decide the file name etc later
		loadCreds("accounts.txt");
		
		Scanner scan = new Scanner(System.in);
		
		System.out.println("Enter Username: ");
		String username = scan.nextLine();
		
		if (!users.containsKey(username)) {
			System.out.println("Username not found.");
			scan.close();
			return;
		}
		
		User user = users.get(username);
		Integer inputID = null;
		
		if (requiresID(user.type)) {
			System.out.println("Enter ID: ");
			if (scan.hasNextInt()) {
				inputID = scan.nextInt();
				scan.nextLine(); //Consume newline
			} else {
				System.out.println("Invalid ID format.");
				scan.close();
				return;
			}
		}
		
		System.out.println("Enter Password: ");
		String password = scan.nextLine();
		
		//Validations of login
		if (authenticate(username, inputID, password)) 
			System.out.println("Login Succesful! Welcome " + user.type + " " + user.username + ".");
		else
			System.out.println("Invalid credentials. Login failed.");
		
		scan.close();
	}

}

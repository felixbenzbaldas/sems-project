package sems;


import java.net.*;
import java.io.*;
import java.util.*;

public class Server {
    static final int port = 8081;
    static final String newLine = "\r\n";

    public static void main(String[] args) {
        System.out.println("hello world!!! :-)");
        try {
            ServerSocket socket = new ServerSocket(port);
            while (true) {
                Socket connection = socket.accept();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    OutputStream outputStream = new BufferedOutputStream(connection.getOutputStream());
                    PrintStream printStream = new PrintStream(outputStream);

                    // read first line of request
                    String request = bufferedReader.readLine();
                    System.out.println("request = " + request);
                    if (request == null) continue;

                    while (true) {
                        String currentLine = bufferedReader.readLine();
                        System.out.println("currentLine = " + currentLine);

                        if (currentLine == null || currentLine.isEmpty()) break;
                    }
//
//                    while (true) {
//                        String currentLine = bufferedReader.readLine();
//                        System.out.println("currentLine = " + currentLine);
//
//                        if (currentLine == null || currentLine.isEmpty()) break;
//                    }


                    if (!request.startsWith("POST ") ||
                            !(request.endsWith(" HTTP/1.0") || request.endsWith(" HTTP/1.1"))) {
                        // bad request
                        printStream.print("HTTP/1.0 400 Bad Request" + newLine + newLine);
                    } else {
                        String response = "Hello, World!";
                        printStream.print(
                                "HTTP/1.0 200 OK" + newLine +
                                        "Content-Type: text/plain" + newLine +
                                        "Date: " + new Date() + newLine +
                                        "Content-length: " + response.length() + newLine + newLine +
                                        response
                        );
                    }
                    printStream.close();
                } catch (Throwable throwable) {
                    System.err.println("Error handling request: " + throwable);
                }
            }
        } catch (Throwable throwable) {
            System.err.println("Could not start server: " + throwable);
        }
    }
}
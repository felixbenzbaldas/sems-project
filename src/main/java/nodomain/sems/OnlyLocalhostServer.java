package nodomain.sems;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import nodomain.sems.core.App;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;


/**
 * This server should only accept requests from the own computer.
 * Be careful with proxies, which might lever out the security check.
 */
public class OnlyLocalhostServer {
    static final int port = 8081;
    static private App app;
    static private ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) throws IOException {
        File configFile = new File(args[0]);
        System.out.println("configFile = " + configFile);
        HashMap<String, Object> jsonConfiguration = (HashMap<String, Object>) new ObjectMapper()
                .readValue(configFile, Object.class);
        File file = new File((String) jsonConfiguration.get("file"));
        installApp(file);
        installServer();
    }

    private static void installApp(File file) throws IOException {
        app = new App(file);
        System.out.println("Filepath of data of only-localhost-server: " + file);
    }

    private static void installServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", httpHandler -> {
            try {
                handle(httpHandler);
            } catch (Throwable t) {
                System.err.println("Error while handling http request!");
                t.printStackTrace();
                httpHandler.sendResponseHeaders(400, -1);
            }
        });
        server.start();
    }

    private static void handle(HttpExchange httpHandler) throws IOException {
        if (httpHandler.getRemoteAddress().getAddress().isLoopbackAddress()) {
            String httpMethod = httpHandler.getRequestMethod();
            System.out.println("httpMethod = " + httpMethod);
            if ("POST".equals(httpMethod)) {// all requests have httpMethod "POST"
                int contentLength = Integer.parseInt(httpHandler.getRequestHeaders().getFirst("Content-Length"));
                String receivedBody = new String(httpHandler.getRequestBody().readNBytes(contentLength), StandardCharsets.UTF_8);
                HashMap<String, Object> receivedJsonBody = objectMapper.readValue(receivedBody, HashMap.class);
                String method = (String) receivedJsonBody.get("method");
                System.out.println("method = " + method);
                List<Object> args = (List) receivedJsonBody.get("args");
                Object responseJson = app.handle(method, args);
                String responseString = objectMapper.writeValueAsString(responseJson);
                System.out.println("responseString = " + responseString);
                byte[] response = responseString.getBytes(StandardCharsets.UTF_8);
                httpHandler.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
                httpHandler.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                httpHandler.sendResponseHeaders(200, response.length);
                OutputStream out = httpHandler.getResponseBody();
                out.write(response);
                out.close();
            } else if ("OPTIONS".equals(httpMethod)) {
                httpHandler.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                httpHandler.getResponseHeaders().add("Access-Control-Allow-Methods", "*");
                httpHandler.getResponseHeaders().add("Access-Control-Allow-Headers", "*");
                httpHandler.sendResponseHeaders(200, -1);
            }
        } else {
            throw new RuntimeException("the request comes from an untrustworthy source!");
        }
    }
}
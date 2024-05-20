package sems;


import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class Server {
    static final int port = 8081;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", httpExchange -> {
            String method = httpExchange.getRequestMethod();
            if ("POST".equals(method)) {
                int contentLength = Integer.parseInt(httpExchange.getRequestHeaders().getFirst("Content-Length"));
                String body = new String(httpExchange.getRequestBody().readNBytes(contentLength), StandardCharsets.UTF_8);
                System.out.println("body = " + body);
            }

            byte[] response = "Hello, World!".getBytes(StandardCharsets.UTF_8);
            httpExchange.getResponseHeaders().add("Content-Type", "text/plain; charset=UTF-8");
            httpExchange.sendResponseHeaders(200, response.length);

            OutputStream out = httpExchange.getResponseBody();
            out.write(response);
            out.close();
        });
        server.start();
    }

}
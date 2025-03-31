import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { server } from "./globals.js";
import "./tools/shorter.js";
import "./tools/planet.js";
import "./tools/planets.js";

dotenv.config();
const app = express();

let transport: SSEServerTransport | null = null;

app.get("/sse", (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);

  // Periodically send ping messages to keep the connection alive
  const interval = setInterval(() => {
    if (transport) {
      const pingMessage: JSONRPCMessage = {
        jsonrpc: "2.0",
        method: "ping",
        params: { message: "keep-alive" },
        id: "ping-keep-alive"
      };
      console.log("Sending ping message:", pingMessage);
      transport.send(pingMessage);
    } else {
      clearInterval(interval);
    }
  }, 30000); // Send a ping every 30 seconds
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(4321, () => {
  console.log("Server started and listening for requests...");
  console.log("You can connect to it using the SSEClientTransport.");
  console.log("For example: new SSEClientTransport(new URL('http://localhost:4321/sse'))");
});
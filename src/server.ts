import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
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
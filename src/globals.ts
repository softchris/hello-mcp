import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const baseUrl = "https://swapi.dev/api";

export const server = new McpServer({
    name: "mcp-server",
    version: "1.0.0",
  }, {
    capabilities: {
      tools: {}
    }
  });
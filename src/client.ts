import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport";
import dotenv from "dotenv";
import OpenAI from "openai";
import { z } from "zod"; // Import zod for schema validation
dotenv.config();

function openAiToolAdapter(tool: {
  name: string;
  description?: string;
  input_schema: any;
}) {
  // Create a zod schema based on the input_schema
  const schema = z.object(tool.input_schema);

  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: tool.input_schema.properties,
        required: tool.input_schema.required,
      },
    },
  };
}

class MCPClient {
  private mcp: Client;
  private openai: OpenAI;
  private tools: Array<any> = [];
  private transport: Transport | null = null;

  constructor() {

    this.openai = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com", // might need to change to this url in the future: https://models.github.ai/inference
        apiKey: process.env.GITHUB_TOKEN,
    });


    // this.openai = new OpenAI({
    //   apiKey: OPENAI_API_KEY,
    // });
    this.mcp = new Client({ name: "mcp-client", version: "1.0.0" });
  }

  async connectToServer(serverUrl: string) {
    try {
      this.transport = new SSEClientTransport(new URL(serverUrl));
      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return openAiToolAdapter({
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        });
      });
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    const messages: any[] = [
      {
        role: "user",
        content: query,
      },
    ];

    console.log("Tools: ", JSON.stringify(this.tools, null, 2));

    let response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages,
      tools: this.tools,
    });

    const finalText: string[] = [];
    const toolResults: any[] = [];

    console.log(
      "Response from OpenAI: ",
      JSON.stringify(response.choices, null, 2)
    );
    response.choices.map(async (choice) => {
      const message = choice.message;
      if (message.tool_calls) {
        toolResults.push(
          await this.callTools(message.tool_calls, toolResults, finalText)
        );
      } else {
        console.log("Message response from LLM: ", message);
        finalText.push(message.content || "xx");
      }
    });

    console.log("Final text before last LLM call", finalText.join("\n"));

    response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages,
      });

      finalText.push(
        `[LLM response] \n ${response.choices[0].message.content}` || "??"
      );

    return finalText.join("\n");
  }
  async callTools(
    tool_calls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: any[],
    finalText: string[]
  ) {
    for (const tool_call of tool_calls) {
      const toolName = tool_call.function.name;
      const args = tool_call.function.arguments;

      console.log(`Calling tool ${toolName} with args ${JSON.stringify(args)}`);

      const toolResult = await this.mcp.callTool({
        name: toolName,
        arguments: JSON.parse(args),
      });

      console.log("Tool result: ", toolResult);

      toolResults.push({
        name: toolName,
        result: toolResult,
      });
 
      finalText.push(
        `[Calling tool ${toolName} with args ${JSON.stringify(args)}]`,
             // @ts-ignore
        `${toolResult.content[0].text}`
      );

    }
  }
  async cleanup() {
    await this.mcp.close();
  }
}

const client = new MCPClient();
await client.connectToServer("http://localhost:4321/sse");
console.log("Connected to MCP server");

// const query = "Tell me about Star Wars planet Alderaan?";
// const result = await client.processQuery(query);
// console.log("Final result: \n ", result);

// const query = "Is Luke shorter than a stormtrooper?";
// const result = await client.processQuery(query);
// console.log("Final result: \n ", result);

const query = "all planets of Star Wars";
const result = await client.processQuery(query);
console.log("Final result: \n ", result);

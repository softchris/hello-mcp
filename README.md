# 🌌 Hello MCP - Star Wars API Tools

Welcome to **Hello MCP**, a Node.js project that provides tools to interact with the Star Wars API (SWAPI). 🚀 Whether you're a Star Wars fan or a developer looking to explore the galaxy far, far away, this project has you covered! 🌠

---

## About

This is a server and client implementation of the MCP protocol. It wraps the Swapi.dev API.

## ✨ Features

- 🔍 **Character Height Comparison**  
    Find out if a Star Wars character is shorter or taller than a stormtrooper.

- 🌍 **Planet Information**  
    Retrieve details about Star Wars planets, including gravity and population.

- 🌍🌍🌍 **Planets Information**  
    Retrieve details about planets in Star Wars.

- ⚡ **Fast and Easy to Use**  
    Built with Node.js for quick and efficient API interactions.

---

## 🚀 Getting Started

Follow these steps to get up and running:

1. **Clone the Repository**  
     ```bash
     git clone https://github.com/your-username/hello-mcp.git
     cd hello-mcp
     ```

2. **Install Dependencies**  
     Make sure you have Node.js installed, then run:  
     ```bash
     npm install
     ```

3. **Run the Project**  

     Start the server with:  

     ```bash
     npm run start:server
     ```

     Start the client with:

     ```bash
     npm run start:client
     ```

     The client runs code like below:

     ```javascript
     const query = "Is Luke shorter than a stormtrooper?";
     const result = await client.processQuery(query);
     console.log("Final result: \n ", result);
     ```

     The preceding code would trigger the tool defined in `/src/tools/shorter.ts`.

## 🛠️ Tools Overview

- **Character Tool**  
    Endpoint: `/tools/call_swapi_character`  
    Input: `{ "name": "Luke Skywalker" }`  
    Output: `"Luke Skywalker is shorter than a stormtrooper."`

- **Planet Tool**  
    Endpoint: `/tools/call_swapi_planet`  
    Input: `{ "name": "Tatooine" }`  
    Output: `"Tatooine has gravity 1 standard with a population of 200000."`

---

## How it works

The client negotiates with the server for its available tools. It will figure out whether to call both tool and getting a generic LLM response. The end result will be a combination of both if available.

## Adding a tool

A tool is created by calling the `server.tool(<toolname>, <description>, { /* implementation */ })`

- Locate one of the tools in `src/tools` and create a new one like so:

   o `src/tools/exampleTool.ts`
   o Add tool to register it in import section in `src/tools/server.ts`
   o Write a query in `src/client.ts` that semantically matches the description you've created for the tool, for example:
      o query: "add 1 to 2"
      o tool description: "adding two numbers"

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

May the Force be with you! 🌟  

## Thank you

- Than you Wassim Chegham for the original code. Also please check out his repo at <https://github.com/manekinekko/openai-mcp-example>
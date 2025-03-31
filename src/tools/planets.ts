import { z } from "zod";
import { server } from "../globals.js";
import { baseUrl } from "../globals.js";

server.tool("call_swapi_planets", "Find all planets of Star Wars", {
  },
  async (args) => {
    console.log("Received request to find out about all Star Wars planets");

    const url = `${baseUrl}/planets`;
    console.log(`calling: ${url}`)

    let planets = await fetch(url)
    .then(res => res.json())
    .then(json => {
      // @ts-ignore
      return json.results;
    });

    // @ts-ignore
    let planetsMapped = planets.map(p => p.name).join(", ");

    return await Promise.resolve({
      content: [
        {
          type: "text",
          text: `Here are some of the planets in Star Wars: ${planetsMapped}`
        }
      ],
    });
  }
);
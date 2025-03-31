import { z } from "zod";
import { server } from "../globals.js";
import { baseUrl } from "../globals.js";

server.tool("call_swapi_planet", "Find star wars planet by name", {
    name: z.string()
  },
  async (args) => {
    console.log("Received request to find out about Star Wars planets");

    const url = `${baseUrl}/planets`;
    console.log(`calling: ${url}`)

    let planets = await fetch(url)
    .then(res => res.json())
    .then(json => {
      // @ts-ignore
      return json.results;
    });

    // @ts-ignore
    let planet = planets.find(p => p.name === args.name);

    console.log(`Found planet: ${planet.name}`);

    return await Promise.resolve({
      content: [
        {
          type: "text",
          text: `${args.name} has gravity ${planet.gravity} with a population of ${planet.population}`
        }
      ],
    });
  }
);
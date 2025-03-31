import { z } from "zod";
import { server } from "../globals.js";
import { baseUrl } from "../globals.js";

server.tool("call_swapi_character", "Shorter than stormtrooper?", {
    name : z.string()
    },async (args) => {
    console.log("Received request to find out about Star Wars characters");
    const url = `${baseUrl}/people`;
    
    // find the character by name
    let people = 
        await fetch(url + "?page=1")
        .then(res => res.json())
        .then(json => json.results)
    
        // @ts-ignore, TODO, look through all pages before giving up
    let person = people.find(p => (p.name + "").startsWith(args.name));
    if (!person) {
        return await Promise.resolve({
        content: [
            {
            type: "text",
            text: `I couldn't find any character named ${args.name}.`
            }
        ],
        });
    }
    console.log(`Found character: ${person.name}`);
    let height = parseInt(person.height);
    
    const stormtrooperHeight = 183; // height of Boba Fett that's a clone of Jango Fett
    return await Promise.resolve({
        content: [
        {
            type: "text",
            text: `${person.name} is ${height < stormtrooperHeight ? "shorter" : "taller"} than a stormtrooper.`
        }
        ],
    });
    }
);





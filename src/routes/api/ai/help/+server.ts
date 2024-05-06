import { json } from "@sveltejs/kit"
import OpenAI from "openai";
import { API_KEY } from "$env/static/private";
import { routesTree } from "$lib/helpers/routesTree.js";


const openai = new OpenAI({
  apiKey: API_KEY,
});


export const POST = async({request}) =>{
    const data = await request.json()
    const { message } = data

    if(!message) return json({error: true, message: "No message provided"})

    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You will be provided a json object that describes the structure and functionality of this website. Use this information to answer in a short response form queries specifically about the website. If a query falls outside this information or your scope, apologize and say 'I'm sorry, I don’t have the information on that topic.' Respond to greetings normally and clearly answer questions about your role or duties."
                },
                {
                    role: "system",
                    content: JSON.stringify(routesTree),
                },
                {
                    role: "system",
                    content: "Some extra information: Only users with the invite token can create an account and use the website, and all top level routes can be accessed from a sidebar that is present on every page."
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        const response = completion.choices?.[0]?.message?.content;
        if (!response) {
            return json({ error: true, message: "Failed to fetch response from AI. Please try again later." });
        }
        return json({success:true, message: response});
    }
    catch(e){
        return json({error:true, message: "Failed to fetch response from AI. Please try again later."});
    }
}
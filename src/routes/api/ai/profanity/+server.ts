import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import { API_KEY } from "$env/static/private";

const openai = new OpenAI({
  apiKey: API_KEY,
});


export const POST = async (request) => {

  const { content } = await request.request.json();

  try{  
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
        {
            role: "system",
            content:
            `Please evaluate whether the provided content contains profanity or language unsuitable for a public platform. Consider the context and intent of the text. Respond with 'Y' if the content is safe and 'N' if it contains profanity or inappropriate language. Note: Focus on the language itself, not the situation being described.`,
        },
        {
            role: "user",
            content: content,
        },
        ],
    });

    const _response = completion.choices?.[0]?.message?.content;
    if (!_response) {
        return json({ error: true, message: "Failed to categorize post" });
    }
    return json({success:true, response: _response});
  }
  catch(e){
    return json({error:true});
  }

  
  
};

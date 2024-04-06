import { Activity, ChatGPTRequest } from "~/models/chat-gpt";
import { composeActivityPrompt, composePrompt1 } from "~/utils/prompts";

const apiKey = process.env.OPENAI_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

export async function getPrompt({ age, physical, interests }: ChatGPTRequest) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: composePrompt1({ age, physical, interests }),
          },
        ],
        model: "gpt-4",
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return console.error("Error:", error);
  }
}

export async function getActivityPrompt(activity: Activity) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: composeActivityPrompt(activity),
          },
        ],
        model: "gpt-4",
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return console.error("Error:", error);
  }
}

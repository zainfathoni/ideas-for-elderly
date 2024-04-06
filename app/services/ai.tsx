const apiKey = process.env.OPENAI_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

export async function getPrompt({ firstName }: { firstName: string }) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [{ role: "user", content: `Hello, my name is ${firstName}` }],
        model: "gpt-4",
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return console.error("Error:", error);
  }
}

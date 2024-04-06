export type ChatGPTRequest = {
  age: number;
  physical: string;
  interests: string;
};

export type Info = ChatGPTRequest & { name: string };

export type ChatGPTResponse = {
  choices: Array<{
    message: Message;
  }>;
};

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Activity = {
  Title: string;
  Timing: string;
  Location: string;
  Interest: string;
  Potential_Service_Provider: string;
  Link_To_Potential_Service_Provider: string;
  Description: string;
};

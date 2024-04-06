export type ChatGPTRequest = {
  age: number;
  physical: string;
  interests: string;
};

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
  Description: string;
  Image_Link: string;
};

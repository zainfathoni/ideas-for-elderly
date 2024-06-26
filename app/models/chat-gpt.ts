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
  name: string;
  time: string;
  loc: string;
  int: string;
  prov: string;
  provLink: string;
  desc: string;
};

export type DetailedActivity = Activity & {
  steps: string;
  things: string;
  aptWeather: string;
  pts: string;

  // TODO: Dzuizz to add more fields
};

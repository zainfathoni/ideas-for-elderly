import { Activity, ChatGPTRequest } from "~/models/chat-gpt";

export const composePrompt1 = ({ age, physical, interests }: ChatGPTRequest) =>
  `You are an intelligent assistant tasked with helping elderly Muslims living in Singapore, aged around ${age}, find engaging and culturally appropriate activities. This group has diverse interests but shares common values in community, faith, and health. They are looking for activities that are suited to their physical ability rated at ${physical}. Given their interests in ${interests}, please suggest activities that are suitable for their age group, considerate of their physical capabilities, and respectful of their cultural and religious practices. Activities should also foster social connections and contribute to their mental and physical well-being. Provide your suggestions in a JSON format, including a title, a detailed description, and, if available, a link to the potential provider, make sure to only link to a publicly accessible website. Additionally, ensure that the activities accommodate their dietary laws (Halal) and prayer times. Do not make things up. I will be fired by my boss if you make things up. Limit the recommendations into a maximum of three activities. Here is the structure for your suggestions (remove all spacing in the JSON format):
    [
        {
            "name": "<Activity Name>",
            "time": "<Suitable Timing for the activity>",
            "loc": "<Location>",
            "int": "<Interest>",
            "prov": "<Potential Service Provider>",
            "provLink": "<Potential Service Provider>",
            "desc": "<Detailed description including time, and any special considerations like accessibility, cultural relevance, or physical demand level>",
        },
        {
            "name": "<Activity Name>",
            "time": "<Suitable Timing for the activity>",
            "loc": "<Location>",
            "int": "<Interest>",
            "prov": "<Potential Service Provider>",
            "provLink": "<Potential Service Provider>",
            "desc": "<Detailed description including time, and any special considerations like accessibility, cultural relevance, or physical demand level>",
        },
    ]
`;

export const composeActivityPrompt = (activity: Activity) =>
    `
    {
        "name": "${activity.name}",
        "time": "${activity.time}",
        "loc": "${activity.loc}",
        "int": "${activity.int}",
        "prov": "${activity.prov}",
        "provLink": "${activity.provLink}",
        "desc": "${activity.desc}",
    },

    Given the above activity, elaborate further on the instructions to participate in the activity and what items to prepare/bring beforehand. Provide your suggestions in a JSON format, including instructions, suitable weather conditions, and, the number of points to be earned upon activity completion. Additionally, ensure that the explanations accommodate their dietary laws (Halal) and prayer times. Do not make things up. I will be fired by my boss if you make things up. Limit the recommendations into a maximum of three activities. Here is the structure for your suggestions (remove all spacing in the JSON format): 

    {
        "steps": "<Instructions for the activity>",
        "things": "<Things to prepare/bring to the activity>",
        "aptWeather": "<Appropriate weather conditions for the activity>",
        "pts": "<Estimated number of points to be won upon activity completion>"
    }
`;
export const composePrompt1 = ({ age, physical, interests }: { age: string, physical: string, interests: string }) =>
    `You are an intelligent assistant tasked with helping elderly Muslims living in Singapore, aged around ${age}, find engaging and culturally appropriate activities. This group has diverse interests but shares common values in community, faith, and health. They are looking for activities that are suited to their physical ability rated at ${physical}. Given their interests in ${interests}, please suggest activities that are suitable for their age group, considerate of their physical capabilities, and respectful of their cultural and religious practices. Activities should also foster social connections and contribute to their mental and physical well-being. Provide your suggestions in a JSON format, including a title, a detailed description, and, if available, a link to an image that visually represents the activity. Additionally, ensure that the activities accommodate their dietary laws (Halal) and prayer times. Here is the structure for your suggestions:
    {
    "Title": "<Activity Name>",
    "Description": "<Detailed description including location, time, and any special considerations like accessibility, cultural relevance, or physical demand level>",
    "Image_Link": "<URL to an image representing the activity, if available>"
    }
`;
export const APIConstants = {
  ChatGPTApiKey: () => process.env.REACT_APP_OPENAI_API_KEY || "",
  BASE_URL: () => process.env.REACT_APP_BASE_URL || "https://api.openai.com/v1",
  MODEL_ID: () => process.env.REACT_APP_MODEL_ID || "gpt-3.5-turbo",
  SYSTEM_PROMPT: () => process.env.REACT_APP_SYSTEM_PROMPT || "",
};

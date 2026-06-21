const apiKey = process.env.AI_IMAGE_API_KEY;

if (!apiKey) {
  throw new Error("Missing AI_IMAGE_API_KEY");
}

export default {
  baseURL: process.env.AI_IMAGE_BASE_URL ?? "https://api2.tabcode.cc/openai/draw/v1",
  apiKey,
}

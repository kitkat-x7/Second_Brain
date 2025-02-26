const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

async function main() {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: "The quick brown",
      encoding_format: "float",
    });
    console.log(embedding.data[0].embedding);
  } catch (error) {
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded. Retrying in 10 seconds...");
      setTimeout(main, 10000); // Retry after 10 seconds
    } else {
      console.error("Error generating embedding:", error);
    }
  }
}

main();


main();
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

    console.log(embedding.data[0].embedding); // Prints the embedding vector
  } catch (error) {
    console.error("Error generating embedding:", error);
  }
}

main();
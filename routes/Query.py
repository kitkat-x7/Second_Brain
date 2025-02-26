from sentence_transformers import SentenceTransformer
import pymongo
import sys

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

client = pymongo.MongoClient("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store")
db = client.store
collection = db.contents
query = sys.argv[1]

def generate_embedding(text: str) -> list[float]:
    embeddings = model.encode(text)
    return embeddings.tolist()


results = collection.aggregate([
  {"$vectorSearch": {
    "queryVector": generate_embedding(query),
    "path": "content_embedding_hf",
    "numCandidates": 100,
    "limit": 1,
    "index": "default",
    }}
]);

for document in results:
    print(f'Title: {document["description"]},\n_Id: {document["_id"]}\n')
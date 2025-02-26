from sentence_transformers import SentenceTransformer
import pymongo
import sys
from bson.objectid import ObjectId

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

client = pymongo.MongoClient("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store")
db = client.store
collection = db.contents
id = sys.argv[1]

def generate_embedding(text: str) -> list[float]:
    embeddings = model.encode(text)
    return embeddings.tolist()

doc = collection.find_one({"_id": ObjectId(id)})
print(doc['description'])
embedding = generate_embedding(doc['description'])
collection.update_one({'_id': doc['_id']}, {'$set': {'content_embedding_hf': embedding}})

print("Embeddings stored successfully!")
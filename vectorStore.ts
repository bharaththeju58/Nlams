import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const DATA_DIR = path.join(process.cwd(), 'data');
const VECTOR_STORE_FILE = path.join(DATA_DIR, 'vector_store.json');

// Make sure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    documentName: string;
    pageNumber?: string;
    section?: string;
    documentId: string;
    uploadDate: string;
    accessRoles: string[]; // e.g. ['admin', 'auditor', 'citizen', 'all']
  };
}

let vectorStore: DocumentChunk[] = [];

// Load store on startup
if (fs.existsSync(VECTOR_STORE_FILE)) {
  try {
    const data = fs.readFileSync(VECTOR_STORE_FILE, 'utf-8');
    vectorStore = JSON.parse(data);
  } catch (error) {
    console.error('Failed to load vector store:', error);
  }
} else {
  // We'll initialize with some default data if empty
}

const saveStore = () => {
  fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(vectorStore, null, 2));
};

export const getAiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set.');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const ai = getAiClient();
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  return response.embeddings?.[0]?.values || [];
};

// Cosine similarity
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const retrieveRelevantChunks = async (query: string, userRole: string, topK: number = 3): Promise<DocumentChunk[]> => {
  if (vectorStore.length === 0) {
    return [];
  }

  const queryEmbedding = await generateEmbedding(query);
  
  // Filter by role
  const accessibleChunks = vectorStore.filter(chunk => {
    if (chunk.metadata.accessRoles.includes('all')) return true;
    if (chunk.metadata.accessRoles.includes(userRole.toLowerCase())) return true;
    return false;
  });

  if (accessibleChunks.length === 0) return [];

  // Calculate similarity
  const chunksWithScores = accessibleChunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort and take topK
  chunksWithScores.sort((a, b) => b.score - a.score);
  
  // Only return chunks with a reasonable similarity score to avoid hallucination from unrelated docs
  return chunksWithScores
    .filter(item => item.score > 0.4) 
    .slice(0, topK)
    .map(item => item.chunk);
};

export const generateAnswer = async (query: string, chunks: DocumentChunk[], history: any[], language: string): Promise<{ answer: string; sources: string[] }> => {
  const ai = getAiClient();
  
  if (chunks.length === 0) {
    // Need to respond in the selected language that info wasn't found
    const noInfoPrompt = `The user asked a question, but there are no relevant documents available to answer it.
Please respond with: "I couldn't find this information in the available NLAMS documents."
Translate exactly this meaning into the user's selected language: ${language}. Do not invent an answer.`;
    
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: noInfoPrompt,
    });
    
    return { answer: res.text || "I couldn't find this information in the available NLAMS documents.", sources: [] };
  }

  const contextText = chunks.map(c => `[Source: ${c.metadata.documentName} — Page ${c.metadata.pageNumber || 'N/A'}]\n${c.text}`).join('\n\n');
  const sourcesList = [...new Set(chunks.map(c => `${c.metadata.documentName} — Page ${c.metadata.pageNumber || 'N/A'}`))];

  const systemPrompt = `You are the NLAMS AI Assistant. You must answer the user's question based ONLY on the following retrieved document context. 
If the answer cannot be found in the context, do not invent facts or make assumptions. Instead, say clearly that the information was not found in the available documents.
Do not present general knowledge as if it came from the documents.
Give a concise and easy-to-understand answer. Preserve important numbers, dates, legal terms, and official terminology.

Retrieved Context:
${contextText}

Important Instruction: Respond in the user's currently selected language: ${language}.`;

  const messages = [];
  // add system prompt as first message implicitly in contents or using systemInstruction
  
  const chatParams: any = {
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    contents: [],
  };

  for (const msg of history) {
    chatParams.contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }
  
  chatParams.contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  const res = await ai.models.generateContent(chatParams);
  
  return {
    answer: res.text || "Error generating answer.",
    sources: sourcesList
  };
};

// Helper to seed initial documents for testing
export const seedInitialDocuments = async () => {
  if (vectorStore.length > 0) return; // already seeded

  console.log('Seeding initial documents for RAG...');

  const initialDocs = [
    {
      text: "Compensation status indicates the current stage of the compensation process for the affected landowner. It helps track whether the compensation has been calculated, approved, disbursed, or is pending. Available stages include: Pending Verification, Approved, Disbursed, and Hold.",
      metadata: {
        documentName: "Land Acquisition Guidelines",
        pageNumber: "12",
        section: "4.2",
        documentId: "doc-1",
        uploadDate: new Date().toISOString(),
        accessRoles: ["all"]
      }
    },
    {
      text: "The stages of compensation are: 1. Survey and Measurement: Assessing the land area. 2. Valuation: Determining the monetary value based on market rates. 3. Approval: Review by the designated authority. 4. Disbursement: Transfer of funds to the landowner's verified bank account.",
      metadata: {
        documentName: "Compensation Policy",
        section: "2.1",
        pageNumber: "5",
        documentId: "doc-2",
        uploadDate: new Date().toISOString(),
        accessRoles: ["all"]
      }
    },
    {
      text: "The following documents are required for initiating a compensation claim: 1. Aadhar Card or valid identity proof. 2. Original Land Title Deed. 3. Bank Account details (Passbook copy). 4. Recent passport size photographs.",
      metadata: {
        documentName: "Required Documents Checklist",
        pageNumber: "2",
        documentId: "doc-3",
        uploadDate: new Date().toISOString(),
        accessRoles: ["all"]
      }
    },
    {
      text: "The land acquisition process involves five main phases: Notification, Social Impact Assessment, Declaration, Award Enquiry, and Taking Possession. The District Collector must oversee the entire process.",
      metadata: {
        documentName: "RFCTLARR Act Summary",
        pageNumber: "1",
        documentId: "doc-4",
        uploadDate: new Date().toISOString(),
        accessRoles: ["all"]
      }
    },
    {
      text: "Internal Audit Guidelines: All disbursement records exceeding Rs. 10 Lakhs must be verified by a Level 2 Auditor before final clearance. Failure to comply may lead to suspension of the disbursing officer.",
      metadata: {
        documentName: "Internal Audit Guidelines",
        pageNumber: "18",
        documentId: "doc-5",
        uploadDate: new Date().toISOString(),
        accessRoles: ["admin", "auditor"]
      }
    }
  ];

  for (const doc of initialDocs) {
    const embedding = await generateEmbedding(doc.text);
    vectorStore.push({
      id: Math.random().toString(36).substring(7),
      text: doc.text,
      embedding,
      metadata: doc.metadata
    });
    // Add a small delay to avoid rate limiting on free tier
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  saveStore();
  console.log('Seeding complete.');
};

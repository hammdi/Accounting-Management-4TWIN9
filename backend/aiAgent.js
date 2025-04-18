//const { Ollama } = require('langchain/llms/ollama');
const { Ollama } = require('@langchain/community/llms/ollama');
//const { initializeAgentExecutorWithOptions } = require('@langchain/community/agents');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@mongo:27017/accounting?authSource=admin';
const client = new MongoClient(MONGO_URI);

// Ollama LLM config
//const llm = new Ollama({ baseUrl: 'http://localhost:11434', model: 'llama3' });
const llm = new Ollama({ baseUrl: 'http://host.docker.internal:11434', model: 'llama3' });
// Tool: Get user transactions summary
const getUserTransactions = async (userId) => {
  const db = client.db();
  const txs = await db.collection('transactions').find({ createdBy: new ObjectId(userId) }).toArray();
  if (!txs.length) return 'No transactions found.';
  const income = txs.filter(t => t.type.toLowerCase() === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type.toLowerCase() === 'expense').reduce((s, t) => s + t.amount, 0);
  return `Total Income: $${income}\nTotal Expense: $${expense}\nNet: $${income - expense}\nCount: ${txs.length}`;
};

// Tool: Get user invoices summary
const getUserInvoices = async (userId) => {
  const db = client.db();
  const invoices = await db.collection('invoices').find({ issuedBy: new ObjectId(userId) }).toArray();
  if (!invoices.length) return 'No invoices found.';
  const pending = invoices.filter(i => i.status === 'Pending');
  if (!pending.length) return 'You have no pending invoices.';
  // Format up to 5 pending invoices
  const summary = pending.slice(0, 5).map(inv => {
    const due = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A';
    return `- Client: ${inv.clientName}, Amount: $${inv.totalAmount || inv.subtotal || 'N/A'}, Due: ${due}, Status: ${inv.status}`;
  }).join('\n');
  return `You have ${pending.length} pending invoice(s):\n${summary}`;
};

// Tool: Get user company info
const getUserCompany = async (userId) => {
  const db = client.db();
  const company = await db.collection('companies').findOne({ owner: new ObjectId(userId) });
  if (!company) return 'No company info found.';
  return `Company: ${company.name}\nTax ID: ${company.taxId || 'N/A'}\nBalance: $${company.balance || 0}`;
};

// Define agent tools
const tools = [
  {
    name: 'getUserTransactions',
    description: 'Get a summary of the user\'s transactions.',
    func: async ({ userId }) => await getUserTransactions(userId),
  },
  {
    name: 'getUserInvoices',
    description: 'Get a summary of the user\'s invoices.',
    func: async ({ userId }) => await getUserInvoices(userId),
  },
  {
    name: 'getUserCompany',
    description: 'Get company info for the user.',
    func: async ({ userId }) => await getUserCompany(userId),
  }
];

// --- Direct tool invocation and LLM answer synthesis ---

// Helper: Detects which tools to call based on keywords
function detectIntents(userMessage) {
  const intents = [];
  const msg = userMessage.toLowerCase();
  if (msg.includes('transaction') || msg.includes('income') || msg.includes('expense') || msg.includes('net income')) {
    intents.push('transactions');
  }
  if (msg.includes('invoice') || msg.includes('pending invoice')) {
    intents.push('invoices');
  }
  if (msg.includes('company') || msg.includes('business')) {
    intents.push('company');
  }
  return intents;
}

// Main AI assistant function
async function runAgent(userMessage, userId) {
  await client.connect();
  const intents = detectIntents(userMessage);
  let txSummary = '', invoiceSummary = '', companySummary = '';

  if (intents.includes('transactions')) {
    txSummary = await getUserTransactions(userId);
  }
  if (intents.includes('invoices')) {
    invoiceSummary = await getUserInvoices(userId);
  }
  if (intents.includes('company')) {
    companySummary = await getUserCompany(userId);
  }

  // Compose context for LLM
  let context = '';
  if (txSummary) context += `Transactions Summary:\n${txSummary}\n`;
  if (invoiceSummary) context += `Invoice Summary:\n${invoiceSummary}\n`;
  if (companySummary) context += `Company Info:\n${companySummary}\n`;

  // Prompt LLM to answer user's question using the context
  const prompt = `You are an AI accounting assistant. Use the following context to answer the user's question.\n\nContext:\n${context}\n\nUser's question: ${userMessage}\n\nAnswer in a helpful, concise, and friendly manner.`;

  const answer = await llm.invoke(prompt);
  return answer;
}

module.exports = { runAgent };

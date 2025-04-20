//const { Ollama } = require('langchain/llms/ollama');
const { Ollama } = require('@langchain/community/llms/ollama');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Import Mongoose models
const Transaction = require('./models/Transaction');
const Invoice = require('./models/Invoice');
const Company = require('./models/Company');

// Ollama LLM config
const llm = new Ollama({ baseUrl: 'http://host.docker.internal:11434', model: 'llama3' });

// Helper: Log context for debugging
function logContext(context) {
  console.log('--- AI Agent Debug Context ---');
  Object.entries(context).forEach(([k, v]) => {
    console.log(`${k}:`, v);
  });
  console.log('-----------------------------');
}

// Tool: Get user transactions summary
const getUserTransactions = async (userId) => {
  if (!ObjectId.isValid(userId)) return 'Invalid user ID.';
  const txs = await Transaction.find({ createdBy: new ObjectId(userId) }).lean();
  logContext({ userId, txCount: txs.length, txs });
  if (!txs.length) return 'No transactions found.';
  const income = txs.filter(t => t.type.toLowerCase() === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type.toLowerCase() === 'expense').reduce((s, t) => s + t.amount, 0);
  return `Total Income: $${income}\nTotal Expense: $${expense}\nNet: $${income - expense}\nCount: ${txs.length}`;
};

// Tool: Get user invoices summary
const getUserInvoices = async (userId) => {
  if (!ObjectId.isValid(userId)) return 'Invalid user ID.';
  const invoices = await Invoice.find({ issuedBy: new ObjectId(userId) }).lean();
  logContext({ userId, invoiceCount: invoices.length, invoices });
  if (!invoices.length) return 'No invoices found.';
  const pending = invoices.filter(i => i.status === 'Pending');
  if (!pending.length) return 'You have no pending invoices.';
  // Format up to 5 pending invoices with computed total
  const summary = pending.slice(0, 5).map(inv => {
    const due = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A';
    // Compute total if missing
    const totalAmt = inv.totalAmount != null
      ? inv.totalAmount
      : ((inv.subtotal || (inv.items || []).reduce((s, it) => s + (it.total || 0), 0)) + (inv.taxAmount || 0) - (inv.discount || 0));
    return `- Client: ${inv.clientName}, Amount: $${totalAmt}, Due: ${due}, Status: ${inv.status}`;
  }).join('\n');
  return `You have ${pending.length} pending invoice(s):\n${summary}`;
};

// Tool: Get user company info
const getUserCompany = async (userId) => {
  if (!ObjectId.isValid(userId)) return 'Invalid user ID.';
  const companies = await Company.find({ owner: new ObjectId(userId) }).lean();
  logContext({ userId, companyCount: companies.length, companies });
  if (!companies.length) return 'No company info found.';
  if (companies.length === 1) {
    const c = companies[0];
    return `Company: ${c.name}\nTax Number: ${c.taxNumber}\nAddress: ${c.address}\nPhone: ${c.phone}\nStatus: ${c.status}`;
  }
  // Multiple companies: list all
  return `You own ${companies.length} companies:\n` + companies.map((c, i) =>
    `${i + 1}. ${c.name} | Tax: ${c.taxNumber} | Address: ${c.address} | Phone: ${c.phone} | Status: ${c.status}`
  ).join('\n');
};

// Tool: Get full invoice details by ID
const getInvoiceDetails = async ({ userId, invoiceId }) => {
  if (!ObjectId.isValid(invoiceId)) return 'Invalid invoice ID.';
  const inv = await Invoice.findById(new ObjectId(invoiceId)).lean();
  if (!inv) return 'Invoice not found.';
  // Check ownership
  if (inv.issuedBy.toString() !== userId.toString()) {
    return 'Access denied: You do not have permission to view this invoice.';
  }
  return inv;
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
  },
  {
    name: 'getInvoiceDetails',
    description: 'Get full invoice object by its ID.',
    func: async ({ userId, invoiceId }) => await getInvoiceDetails({ userId, invoiceId }),
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
  // DB connection is established at startup, do not reconnect here
  const intents = detectIntents(userMessage);
  let txSummary = '', invoiceSummary = '', companySummary = '', invoiceDetails = '';

  // Detect if message contains a 24-char invoice ID
  const idMatch = userMessage.match(/([0-9a-fA-F]{24})/);
  if (idMatch) {
    invoiceDetails = await Invoice.findById(new ObjectId(idMatch[1])).lean();
  }

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
  if (invoiceDetails) {
    context += `Invoice Details:\n${JSON.stringify(invoiceDetails)}\n`;
  } else if (invoiceSummary) {
    context += `Invoice Summary:\n${invoiceSummary}\n`;
  }
  if (companySummary) context += `Company Info:\n${companySummary}\n`;

  // Prompt LLM to answer user's question using the context
  const prompt = `You are an AI accounting assistant. Use the following context to answer the user's question.\n\nContext:\n${context}\n\nUser's question: ${userMessage}\n\nAnswer in a helpful, concise, and friendly manner.`;

  const answer = await llm.invoke(prompt);
  return answer;
}

module.exports = { runAgent };

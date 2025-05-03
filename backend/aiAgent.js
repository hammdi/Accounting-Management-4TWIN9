const { Ollama } = require('@langchain/community/llms/ollama');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Import Mongoose models
const Transaction = require('./models/Transaction');
const Invoice = require('./models/Invoice');
const Company = require('./models/Company');
const Payroll = require('./models/Payroll');
const TaxCompliance = require('./models/Tax Compliance');

// Ollama LLM config
const llm = new Ollama({
    baseUrl: 'http://host.docker.internal:11434',
    model: 'llama3'
});

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
    
    const income = txs.filter(t => t.type.toLowerCase() === 'income')
                     .reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type.toLowerCase() === 'expense')
                      .reduce((s, t) => s + t.amount, 0);
    
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

    const summary = pending.slice(0, 5).map(inv => {
        const due = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A';
        const totalAmt = inv.totalAmount ?? 
            ((inv.subtotal || (inv.items || []).reduce((s, it) => s + (it.total || 0), 0)) + 
             (inv.taxAmount || 0) - (inv.discount || 0));
        
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

    return `You own ${companies.length} companies:\n` + 
           companies.map((c, i) => 
               `${i + 1}. ${c.name} | Tax: ${c.taxNumber} | Address: ${c.address} | Phone: ${c.phone} | Status: ${c.status}`
           ).join('\n');
};

// Tool: Get user payroll summary
const getUserPayroll = async (userId) => {
    if (!ObjectId.isValid(userId)) return 'Invalid user ID.';
    const payrolls = await Payroll.find({ createdBy: new ObjectId(userId) })
        .populate('company employee')
        .lean();
    
    logContext({ userId, payrollCount: payrolls.length, payrolls });
    
    if (!payrolls.length) return 'No payroll records found.';
    
    // Group by company
    const byCompany = payrolls.reduce((acc, p) => {
        const companyName = p.company?.name || 'Unknown Company';
        if (!acc[companyName]) {
            acc[companyName] = {
                total: 0,
                employees: new Set(),
                latestPayment: null,
                pendingCount: 0
            };
        }
        acc[companyName].total += p.salary;
        acc[companyName].employees.add(p.employee?._id.toString());
        if (p.status === 'Pending') acc[companyName].pendingCount++;
        if (!acc[companyName].latestPayment || 
            new Date(p.paymentDate) > new Date(acc[companyName].latestPayment)) {
            acc[companyName].latestPayment = p.paymentDate;
        }
        return acc;
    }, {});

    const summary = Object.entries(byCompany)
        .map(([company, data]) => 
            `${company}:\n` +
            `Total Payroll: $${data.total.toFixed(2)}\n` +
            `Employees: ${data.employees.size}\n` +
            `Pending Payments: ${data.pendingCount}\n` +
            `Latest Payment: ${new Date(data.latestPayment).toLocaleDateString()}`
        ).join('\n\n');

    return summary;
};

// Tool: Get user tax compliance summary
const getUserTaxCompliance = async (userId) => {
    if (!ObjectId.isValid(userId)) return 'Invalid user ID.';
    const taxes = await TaxCompliance.find({ createdBy: new ObjectId(userId) })
        .populate('company')
        .lean();
    
    logContext({ userId, taxCount: taxes.length, taxes });
    
    if (!taxes.length) return 'No tax records found.';

    // Group by company and tax year
    const byCompanyYear = taxes.reduce((acc, tax) => {
        const companyName = tax.company?.name || 'Unknown Company';
        const year = tax.taxYear || 'Unknown Year';
        const key = `${companyName}-${year}`;
        
        if (!acc[key]) {
            acc[key] = {
                totalAmount: 0,
                pending: 0,
                filed: 0,
                nextDue: null
            };
        }
        
        acc[key].totalAmount += tax.taxAmount;
        tax.status === 'Pending' ? acc[key].pending++ : acc[key].filed++;
        
        if (!acc[key].nextDue || new Date(tax.dueDate) < new Date(acc[key].nextDue)) {
            acc[key].nextDue = tax.dueDate;
        }
        
        return acc;
    }, {});

    const summary = Object.entries(byCompanyYear)
        .map(([key, data]) => {
            const [company, year] = key.split('-');
            return `${company} (${year}):\n` +
                   `Total Tax Amount: $${data.totalAmount.toFixed(2)}\n` +
                   `Status: ${data.filed} Filed, ${data.pending} Pending\n` +
                   `Next Due Date: ${data.nextDue ? new Date(data.nextDue).toLocaleDateString() : 'N/A'}`;
        }).join('\n\n');

    return summary;
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
        name: 'getUserPayroll',
        description: 'Get a summary of the user\'s payroll records.',
        func: async ({ userId }) => await getUserPayroll(userId),
    },
    {
        name: 'getUserTaxCompliance',
        description: 'Get a summary of the user\'s tax compliance records.',
        func: async ({ userId }) => await getUserTaxCompliance(userId),
    }
];

// Helper: Detects which tools to call based on keywords
function detectIntents(userMessage) {
    const intents = [];
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('transaction') || msg.includes('income') || 
        msg.includes('expense') || msg.includes('net income')) {
        intents.push('transactions');
    }
    if (msg.includes('invoice') || msg.includes('pending invoice')) {
        intents.push('invoices');
    }
    if (msg.includes('company') || msg.includes('business')) {
        intents.push('company');
    }
    if (msg.includes('payroll') || msg.includes('salary') || 
        msg.includes('wage') || msg.includes('employee payment')) {
        intents.push('payroll');
    }
    if (msg.includes('tax') || msg.includes('compliance') || 
        msg.includes('irs') || msg.includes('tax form')) {
        intents.push('tax');
    }
    return intents;
}

// Main AI assistant function
async function runAgent(userMessage, userId) {
    const intents = detectIntents(userMessage);
    let context = '';
    
    // Gather all relevant information based on intents
    if (intents.includes('transactions')) {
        const txSummary = await getUserTransactions(userId);
        context += `Transactions Summary:\n${txSummary}\n\n`;
    }
    
    if (intents.includes('invoices')) {
        const invoiceSummary = await getUserInvoices(userId);
        context += `Invoice Summary:\n${invoiceSummary}\n\n`;
    }
    
    if (intents.includes('company')) {
        const companySummary = await getUserCompany(userId);
        context += `Company Info:\n${companySummary}\n\n`;
    }
    
    if (intents.includes('payroll')) {
        const payrollSummary = await getUserPayroll(userId);
        context += `Payroll Summary:\n${payrollSummary}\n\n`;
    }
    
    if (intents.includes('tax')) {
        const taxSummary = await getUserTaxCompliance(userId);
        context += `Tax Compliance:\n${taxSummary}\n\n`;
    }

    // Prompt LLM to answer user's question using the context
    const prompt = `You are an AI accounting assistant. Use the following context to answer the user's question.

Context:
${context}

User's question: ${userMessage}

Answer in a helpful, concise, and friendly manner.`;

    const answer = await llm.invoke(prompt);
    return answer;
}

module.exports = {
    runAgent
};

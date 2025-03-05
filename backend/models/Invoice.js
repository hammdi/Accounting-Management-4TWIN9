const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    //issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issuedBy: { type: String },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    dueDate: { type: Date, required: true },

    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },

    items: [{
        name: { type: String,  },
        quantity: { type: Number,  },
        unit: { type: String,  },
        unitPrice: { type: Number,  },
        taxRate: { type: Number, enum: [0, 7, 13, 19] }, // Flexible tax rate
        total: { type: Number,  }
    }],

    subtotal: { type: Number,  },
    discount: { type: Number, default: 0 },
    taxAmount: { type: Number,  },
    totalAmount: { type: Number,  }

}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);

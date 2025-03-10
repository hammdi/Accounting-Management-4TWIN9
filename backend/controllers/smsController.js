const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendInvoiceSMS = async (req, res) => {
    try {
        const { invoiceId, phoneNumber } = req.body;
        
        // Format Tunisian phone number
        let formattedNumber = phoneNumber;
        
        // Remove any spaces or special characters
        formattedNumber = formattedNumber.replace(/\D/g, '');
        
        // If it's a local Tunisian number (starts with 0 or no prefix), add +216
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '+216' + formattedNumber.substring(1);
        } else if (!formattedNumber.startsWith('+216')) {
            formattedNumber = '+216' + formattedNumber;
        }

        // Validate the formatted number
        if (!formattedNumber.startsWith('+216') || formattedNumber.length !== 13) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Tunisian phone number format. Please use a valid Tunisian number.'
            });
        }

        // Get invoice details
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Create bilingual SMS message
        const message = `Facture #${invoice.invoiceNumber}

Français:
Bonjour ${invoice.clientName},
Votre facture #${invoice.invoiceNumber} est disponible.
Total: ${invoice.totalAmount} DT
Date: ${invoice.issueDate}

عربي:
مرحباً ${invoice.clientName},
فاتورتك #${invoice.invoiceNumber} جاهزة.
المبلغ الإجمالي: ${invoice.totalAmount} دينار
التاريخ: ${invoice.issueDate}`;

        // Send SMS using Twilio
        await client.messages.create({
            body: message,
            from: twilioNumber,
            to: formattedNumber
        });

        res.status(200).json({
            success: true,
            message: 'SMS sent successfully'
        });

    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS'
        });
    }
};

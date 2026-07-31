const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ObjectStatus = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

const mockBorrowers = [
    { id: 'CUST-8932', name: 'Raj Kumar', loanType: 'Auto Loan', emiAmount: 14500, riskScore: 88, riskCategory: 'High', daysPastDue: 45, recommendedAction: 'Restructure Loan' },
    { id: 'CUST-1044', name: 'Priya Sharma', loanType: 'Personal', emiAmount: 8200, riskScore: 92, riskCategory: 'High', daysPastDue: 62, recommendedAction: 'Immediate Legal Notice' },
    { id: 'CUST-5521', name: 'Amit Singh', loanType: 'Home Loan', emiAmount: 32000, riskScore: 45, riskCategory: 'Medium', daysPastDue: 12, recommendedAction: 'Automated Reminder' },
    { id: 'CUST-9923', name: 'Sneha Patel', loanType: 'Credit Card', emiAmount: 4500, riskScore: 22, riskCategory: 'Low', daysPastDue: 0, recommendedAction: 'No Action Needed' },
    { id: 'CUST-3841', name: 'Vikram Das', loanType: 'Auto Loan', emiAmount: 11200, riskScore: 78, riskCategory: 'High', daysPastDue: 35, recommendedAction: 'Agent Call' },
    { id: 'CUST-7742', name: 'Neha Gupta', loanType: 'Personal', emiAmount: 5000, riskScore: 60, riskCategory: 'Medium', daysPastDue: 18, recommendedAction: 'Discount Settlement' },
    { id: 'CUST-2198', name: 'Rahul Verma', loanType: 'Home Loan', emiAmount: 45000, riskScore: 15, riskCategory: 'Low', daysPastDue: 0, recommendedAction: 'No Action Needed' },
    { id: 'CUST-6634', name: 'Anjali Desai', loanType: 'Credit Card', emiAmount: 12500, riskScore: 85, riskCategory: 'High', daysPastDue: 50, recommendedAction: 'Agent Call & Legal Warning' }
];

app.get('/api/borrowers', (req, res) => {
    res.json(mockBorrowers);
});

app.get('/api/borrowers/:id', (req, res) => {
    const borrower = mockBorrowers.find(b => b.id === req.params.id);
    if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
    res.json(borrower);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

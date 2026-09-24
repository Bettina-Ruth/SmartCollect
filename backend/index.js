const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * Converts Prisma's Decimal fields to plain JS numbers so the response is
 * safe to JSON.stringify and matches what the frontend expects.
 */
function serializeLoan(loan) {
    return {
        id: loan.id,
        loanType: loan.loanType,
        principalAmount: Number(loan.principalAmount),
        emiAmount: Number(loan.emiAmount),
        outstandingAmount: Number(loan.outstandingAmount),
        status: loan.status,
        payments: (loan.payments || []).map((p) => ({
            id: p.id,
            amount: Number(p.amount),
            dueDate: p.dueDate,
            paidDate: p.paidDate,
            status: p.status,
        })),
    };
}

/**
 * Flattens a Borrower + Loans[] record into the shape the frontend's
 * `Borrower` interface already expects (loanType/emiAmount at the top
 * level, taken from the borrower's primary/first loan), while also
 * including the full `loans` array for anything that needs more detail.
 */
function serializeBorrower(borrower) {
    const [primaryLoan] = borrower.loans;

    return {
        id: borrower.id,
        name: borrower.name,
        loanType: primaryLoan ? primaryLoan.loanType : null,
        emiAmount: primaryLoan ? Number(primaryLoan.emiAmount) : 0,
        riskScore: borrower.riskScore,
        riskCategory: borrower.riskCategory,
        daysPastDue: borrower.daysPastDue,
        recommendedAction: borrower.recommendedAction,
        loans: borrower.loans.map(serializeLoan),
    };
}

app.get('/api/borrowers', async (req, res) => {
    try {
        const borrowers = await prisma.borrower.findMany({
            include: {
                loans: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(borrowers.map(serializeBorrower));
    } catch (error) {
        console.error('Failed to fetch borrowers:', error);
        res.status(500).json({ error: 'Failed to fetch borrowers' });
    }
});

app.get('/api/borrowers/:id', async (req, res) => {
    try {
        const borrower = await prisma.borrower.findUnique({
            where: { id: req.params.id },
            include: {
                loans: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        payments: {
                            orderBy: { dueDate: 'asc' },
                        },
                    },
                },
            },
        });

        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }

        res.json(serializeBorrower(borrower));
    } catch (error) {
        console.error(`Failed to fetch borrower ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch borrower' });
    }
});

// Basic health check so it's easy to confirm the DB connection is alive.
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
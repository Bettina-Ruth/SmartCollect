const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Same 8 borrowers that previously lived in mockBorrowers / frontend mock data.
// Loan figures (principal/outstanding) are realistic estimates derived from
// each borrower's existing EMI, loan type and delinquency status.
//
// Loan and Payment ids below are deterministic (derived from the borrower id)
// specifically so this script is safe to run repeatedly: every run upserts
// the same records by id instead of inserting new ones, so re-seeding never
// creates duplicate loans or payments.
const borrowers = [
    {
        id: 'CUST-8932', name: 'Raj Kumar', riskScore: 88, riskCategory: 'High',
        daysPastDue: 45, recommendedAction: 'Restructure Loan',
        loan: {
            loanType: 'Auto Loan', emiAmount: 14500, principalAmount: 520000,
            outstandingAmount: 398000, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-1044', name: 'Priya Sharma', riskScore: 92, riskCategory: 'High',
        daysPastDue: 62, recommendedAction: 'Immediate Legal Notice',
        loan: {
            loanType: 'Personal', emiAmount: 8200, principalAmount: 196800,
            outstandingAmount: 143500, status: 'DEFAULTED',
        },
    },
    {
        id: 'CUST-5521', name: 'Amit Singh', riskScore: 45, riskCategory: 'Medium',
        daysPastDue: 12, recommendedAction: 'Automated Reminder',
        loan: {
            loanType: 'Home Loan', emiAmount: 32000, principalAmount: 4200000,
            outstandingAmount: 3650000, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-9923', name: 'Sneha Patel', riskScore: 22, riskCategory: 'Low',
        daysPastDue: 0, recommendedAction: 'No Action Needed',
        loan: {
            loanType: 'Credit Card', emiAmount: 4500, principalAmount: 90000,
            outstandingAmount: 31500, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-3841', name: 'Vikram Das', riskScore: 78, riskCategory: 'High',
        daysPastDue: 35, recommendedAction: 'Agent Call',
        loan: {
            loanType: 'Auto Loan', emiAmount: 11200, principalAmount: 403200,
            outstandingAmount: 312400, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-7742', name: 'Neha Gupta', riskScore: 60, riskCategory: 'Medium',
        daysPastDue: 18, recommendedAction: 'Discount Settlement',
        loan: {
            loanType: 'Personal', emiAmount: 5000, principalAmount: 120000,
            outstandingAmount: 87500, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-2198', name: 'Rahul Verma', riskScore: 15, riskCategory: 'Low',
        daysPastDue: 0, recommendedAction: 'No Action Needed',
        loan: {
            loanType: 'Home Loan', emiAmount: 45000, principalAmount: 5800000,
            outstandingAmount: 5210000, status: 'ACTIVE',
        },
    },
    {
        id: 'CUST-6634', name: 'Anjali Desai', riskScore: 85, riskCategory: 'High',
        daysPastDue: 50, recommendedAction: 'Agent Call & Legal Warning',
        loan: {
            loanType: 'Credit Card', emiAmount: 12500, principalAmount: 250000,
            outstandingAmount: 198000, status: 'DEFAULTED',
        },
    },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Builds 3 past monthly payments + 1 upcoming payment for a loan, based on
 * how many days past due the borrower currently is (roughly 1 missed
 * installment per 30 days past due, capped at 3). Each payment gets a
 * deterministic id (derived from the loan id) so re-running the seed
 * upserts the same 4 rows instead of inserting new ones.
 */
function buildPayments(loanId, emiAmount, daysPastDue) {
    const now = Date.now();
    const missedCount = daysPastDue > 0 ? Math.min(3, Math.ceil(daysPastDue / 30)) : 0;
    const payments = [];

    for (let i = 0; i < 3; i += 1) {
        const dueDate = new Date(now - (3 - i) * 30 * DAY_MS);
        const isMissed = i >= 3 - missedCount;

        payments.push({
            id: `${loanId}-PAY-${i + 1}`,
            amount: emiAmount,
            dueDate,
            paidDate: isMissed ? null : new Date(dueDate.getTime() + 2 * DAY_MS),
            status: isMissed ? 'OVERDUE' : 'PAID',
        });
    }

    // Upcoming installment
    payments.push({
        id: `${loanId}-PAY-4`,
        amount: emiAmount,
        dueDate: new Date(now + 15 * DAY_MS),
        paidDate: null,
        status: 'PENDING',
    });

    return payments;
}

async function main() {
    console.log(`Seeding ${borrowers.length} borrowers (safe to re-run)...`);

    for (const b of borrowers) {
        const { loan, ...borrowerFields } = b;
        const { id: borrowerId, ...borrowerRest } = borrowerFields;
        const loanId = `${borrowerId}-LOAN-1`;

        // Upsert the borrower itself, syncing fields on every run.
        await prisma.borrower.upsert({
            where: { id: borrowerId },
            update: borrowerRest,
            create: { id: borrowerId, ...borrowerRest },
        });

        // Upsert the loan by a deterministic id, syncing fields on every run.
        await prisma.loan.upsert({
            where: { id: loanId },
            update: loan,
            create: { id: loanId, borrowerId, ...loan },
        });

        // Upsert each payment by a deterministic id, syncing fields on every run.
        const payments = buildPayments(loanId, loan.emiAmount, borrowerFields.daysPastDue);
        for (const payment of payments) {
            const { id: paymentId, ...paymentRest } = payment;
            await prisma.payment.upsert({
                where: { id: paymentId },
                update: paymentRest,
                create: { id: paymentId, loanId, ...paymentRest },
            });
        }

        console.log(`  - ${borrowerId} (${borrowerFields.name}): 1 loan, ${payments.length} payments`);
    }

    console.log('Seed complete.');
}

main()
    .catch((err) => {
        console.error('Seed failed:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
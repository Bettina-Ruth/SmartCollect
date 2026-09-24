// Data models

export interface Loan {
    id: string;
    loanType: string;
    principalAmount: number;
    emiAmount: number;
    outstandingAmount: number;
    status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED' | 'RESTRUCTURED';
    payments?: Payment[];
}

export interface Payment {
    id: string;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'FAILED';
}

export interface Borrower {
    id: string;
    name: string;
    loanType: string | null;
    emiAmount: number;
    riskScore: number;
    riskCategory: 'High' | 'Medium' | 'Low';
    daysPastDue: number;
    recommendedAction: string;
    loans?: Loan[];
}

const API_URL = 'http://localhost:5001/api';

export const apiService = {
    getBorrowers: async (): Promise<Borrower[]> => {
        const response = await fetch(`${API_URL}/borrowers`);
        if (!response.ok) {
            throw new Error(`Failed to fetch borrowers: ${response.status}`);
        }
        return await response.json();
    },

    getBorrowerById: async (id: string): Promise<Borrower | undefined> => {
        const response = await fetch(`${API_URL}/borrowers/${id}`);
        if (response.status === 404) {
            return undefined;
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch borrower ${id}: ${response.status}`);
        }
        return await response.json();
    },
};
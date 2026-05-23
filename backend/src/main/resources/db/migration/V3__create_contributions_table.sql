CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contribution_date DATE NOT NULL,
    employee_amount DECIMAL(12,2) NOT NULL,
    employer_amount DECIMAL(12,2) NOT NULL,
    pay_period VARCHAR(20)
);

CREATE INDEX idx_contributions_account_id ON contributions(account_id);
CREATE INDEX idx_contributions_date ON contributions(contribution_date);

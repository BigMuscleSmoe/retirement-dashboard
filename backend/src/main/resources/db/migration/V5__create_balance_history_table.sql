CREATE TABLE balance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    balance DECIMAL(15,2) NOT NULL
);

CREATE INDEX idx_balance_history_account_id ON balance_history(account_id);
CREATE INDEX idx_balance_history_date ON balance_history(record_date);

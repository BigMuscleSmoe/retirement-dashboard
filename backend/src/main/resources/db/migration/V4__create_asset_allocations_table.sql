CREATE TABLE asset_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    asset_class VARCHAR(50) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    as_of_date DATE NOT NULL
);

CREATE INDEX idx_asset_allocations_account_id ON asset_allocations(account_id);

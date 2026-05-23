-- Demo user (password: "password123")
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'demo@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Steven Zhang', 'USER');

-- Demo 401(k) account
INSERT INTO accounts (id, user_id, account_name, current_balance, employer_match_pct) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Traditional 401(k)', 185750.00, 4.00);

-- Contributions (last 12 months, biweekly)
INSERT INTO contributions (account_id, contribution_date, employee_amount, employer_amount, pay_period) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-01-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-01-31', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-02-14', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-02-28', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-14', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-31', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-04-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-04-30', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-05-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-05-31', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-06-13', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-06-30', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-07-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-07-31', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-08-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-08-29', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-09-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-09-30', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-10-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-10-31', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-14', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-28', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-12-15', 750.00, 300.00, 'BIWEEKLY'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-12-31', 750.00, 300.00, 'BIWEEKLY');

-- Asset allocations
INSERT INTO asset_allocations (account_id, asset_class, percentage, as_of_date) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'US_EQUITY', 55.00, '2025-12-31'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'INTL_EQUITY', 20.00, '2025-12-31'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'BOND', 15.00, '2025-12-31'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'REAL_ESTATE', 5.00, '2025-12-31'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'CASH', 5.00, '2025-12-31');

-- Balance history (monthly snapshots for 2 years)
INSERT INTO balance_history (account_id, record_date, balance) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-01-31', 142000.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-02-29', 145200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-31', 148800.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-04-30', 146500.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-05-31', 151200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-06-30', 155800.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-07-31', 158400.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-08-31', 156200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-09-30', 160100.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-10-31', 163500.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-11-30', 167200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-12-31', 170800.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-01-31', 173500.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-02-28', 175200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-31', 177800.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-04-30', 176100.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-05-31', 179500.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-06-30', 182300.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-07-31', 180100.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-08-31', 183400.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-09-30', 181200.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-10-31', 183800.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-30', 184900.00),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-12-31', 185750.00);

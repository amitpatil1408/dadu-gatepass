-- DADU GatePass Database Schema

CREATE TABLE roles (
id SERIAL PRIMARY KEY,
role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
phone VARCHAR(15),
password_hash TEXT NOT NULL,
role_id INTEGER NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

```
CONSTRAINT fk_users_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
```

);

CREATE TABLE pass_types (
id SERIAL PRIMARY KEY,
pass_name VARCHAR(50) UNIQUE NOT NULL,
max_duration_days INTEGER,
requires_approval BOOLEAN DEFAULT TRUE
);

CREATE TABLE passes (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
pass_type_id INTEGER NOT NULL,
destination TEXT NOT NULL,
reason TEXT,
out_time TIMESTAMP NOT NULL,
expected_in_time TIMESTAMP NOT NULL,
status VARCHAR(20) DEFAULT 'pending',
approved_by_user_id INTEGER,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
qr_token VARCHAR(255),

```
CONSTRAINT fk_pass_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

CONSTRAINT fk_pass_type
    FOREIGN KEY (pass_type_id)
    REFERENCES pass_types(id),

CONSTRAINT fk_approver
    FOREIGN KEY (approved_by_user_id)
    REFERENCES users(id)
```

);

CREATE TABLE approvals (
id SERIAL PRIMARY KEY,
pass_id INTEGER NOT NULL,
approved_by_user_id INTEGER NOT NULL,
status VARCHAR(20) NOT NULL,
remarks TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

```
CONSTRAINT fk_approval_pass
    FOREIGN KEY (pass_id)
    REFERENCES passes(id),

CONSTRAINT fk_approval_user
    FOREIGN KEY (approved_by_user_id)
    REFERENCES users(id)
```

);

CREATE TABLE gate_logs (
id SERIAL PRIMARY KEY,
pass_id INTEGER NOT NULL,
action VARCHAR(10) NOT NULL,
scanned_by_user_id INTEGER NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

```
CONSTRAINT fk_gate_pass
    FOREIGN KEY (pass_id)
    REFERENCES passes(id),

CONSTRAINT fk_gate_user
    FOREIGN KEY (scanned_by_user_id)
    REFERENCES users(id)
```

);

-- Default Roles

INSERT INTO roles (id, role_name) VALUES
(1, 'student'),
(2, 'faculty'),
(3, 'security'),
(4, 'admin'),
(5, 'hostel_superintendent'),
(6, 'conference_supervisor'),
(7, 'conference_participant'),
(8, 'visitor');

-- Default Pass Types

INSERT INTO pass_types (id, pass_name, max_duration_days, requires_approval) VALUES
(1, 'day_pass', 1, TRUE),
(2, 'outstation_pass', 7, TRUE),
(3, 'vacation_pass', 30, TRUE),
(4, 'visitor_pass', 1, TRUE),
(5, 'conference_pass', 4, TRUE);

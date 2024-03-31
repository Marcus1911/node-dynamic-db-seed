# db_setup.py, adjusted for environment variables
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# def setup_database():
#     connection_details = (
#         f"dbname={os.getenv('POSTGRES_DB')} "
#         f"user={os.getenv('POSTGRES_USER')} "
#         f"password={os.getenv('POSTGRES_PASSWORD')} "
#         f"host={os.getenv('POSTGRES_HOST')}"
#     )

connection_details = 'dbname=directus user=calcom password=123456 host=postgres'
conn = psycopg2.connect(connection_details)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

cursor = conn.cursor()

# Table 1 Creation
cursor.execute('''
CREATE TABLE IF NOT EXISTS table1 (
    id SERIAL PRIMARY KEY,
    registration_order_id VARCHAR(255),
    relationship VARCHAR(255),
    proficiency VARCHAR(255),
    home_bmx_track_id INT,
    membership_level VARCHAR(255),
    bmx_membership_type_id INT,
    auto_renew BOOLEAN,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    gender VARCHAR(50),
    born_on DATE,
    phone_type VARCHAR(50),
    phone VARCHAR(50),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    serial_number VARCHAR(255),
    prerequisite_serial_number VARCHAR(255),
    price DECIMAL,
    membership_type_custom VARCHAR(255),
    bmx_member_id VARCHAR(255)
);
''')

# Table 2 Creation
cursor.execute('''
CREATE TABLE IF NOT EXISTS table2 (
    id SERIAL PRIMARY KEY,
    registration_order_id VARCHAR(255),
    relationship VARCHAR(255),
    proficiency VARCHAR(255),
    home_bmx_track_id INT,
    membership_level VARCHAR(255),
    bmx_membership_type_id INT,
    auto_renew BOOLEAN
);
''')

# Insert Dummy Data into Table 1
cursor.execute('''
INSERT INTO table1 (
    registration_order_id, relationship, proficiency, home_bmx_track_id, 
    membership_level, bmx_membership_type_id, auto_renew, first_name, last_name, 
    gender, born_on, phone_type, phone, address_line_1, address_line_2, city, 
    state, postal_code, country, emergency_contact_name, emergency_contact_phone, 
    serial_number, prerequisite_serial_number, price, membership_type_custom, bmx_member_id
) VALUES (
    '001', 'Parent', 'Beginner', 1, 
    'Gold', 1, TRUE, 'John', 'Doe', 
    'M', '2010-01-01', 'Mobile', '123-456-7890', '123 Main St', 'Suite 100', 'Anytown', 
    'Anystate', '12345', 'USA', 'Jane Doe', '987-654-3210', 
    'SN123456', 'PSN7890', 100.00, 'Annual', 'BMX123'
);
''')

cursor.close()
conn.close()

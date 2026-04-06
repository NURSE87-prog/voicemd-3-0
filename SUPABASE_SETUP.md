# Supabase Database Setup Guide

To make your dashboard functional for saving patients and notes, please copy and run the following SQL in your **Supabase SQL Editor**.

## 1. Patients Table
```sql
-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  email TEXT,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Doctors can only see their own patients
CREATE POLICY "Doctors can manage their own patients" 
ON patients FOR ALL 
USING (auth.uid() = doctor_id);
```

## 2. Notes Table
```sql
-- Create clinical_notes table
CREATE TABLE clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'SOAP',
  chief_complaint TEXT,
  content JSONB,
  status TEXT DEFAULT 'Needs Review'
);

-- Enable RLS
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Doctors can only see their own notes
CREATE POLICY "Doctors can manage their own notes" 
ON clinical_notes FOR ALL 
USING (auth.uid() = doctor_id);
```

## 3. Important: Disable Email Confirmation
For testing purposes, you should disable email confirmation so you can sign up and log in immediately.

1. Go to **Authentication > Providers > Email**.
2. Toggle off **Confirm email**.
3. Click **Save**.

---
Once you have run these commands and disabled email confirmation, you will be able to log in to the dashboard and start building real features!

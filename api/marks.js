// SOLUTION 1: Simple API that works with URL parameters
// File: api/marks.js - This replaces both getmarks.js and savemarks.js

// Global variable to store marks (will reset when serverless function cold starts)
// For production, use a database like MongoDB Atlas, Supabase, or Vercel KV
const marksStorage = global.marksStorage || (global.marksStorage = {});

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - retrieve marks
  if (req.method === 'GET') {
    const { subject, action } = req.query;
    
    if (action === 'list') {
      // Return all subjects with data
      return res.status(200).json({
        subjects: Object.keys(marksStorage),
        data: marksStorage
      });
    }
    
    if (!subject) {
      return res.status(400).json({ error: 'Subject parameter is required' });
    }
    
    const validSubjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
    
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject code' });
    }
    
    const marks = marksStorage[subject] || '';
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(marks);
  }
  
  // POST - save marks
  if (req.method === 'POST') {
    const { subject, marks } = req.body;
    
    if (!subject || marks === undefined) {
      return res.status(400).json({ error: 'Subject and marks are required' });
    }
    
    const validSubjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
    
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject code' });
    }
    
    // Store marks
    marksStorage[subject] = marks;
    
    console.log(`Marks saved for ${subject}:`, marks); // For debugging
    
    return res.status(200).json({ 
      message: 'Marks saved successfully',
      subject: subject,
      totalLines: marks.split('\n').filter(line => line.trim() !== '').length
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

/*
ALTERNATIVE SOLUTION 2: Using Environment Variables (more persistent)

If you want more persistence, you can use Vercel's environment variables:

// File: api/marks-env.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    const { subject } = req.query;
    const envVar = `MARKS_${subject.toUpperCase()}`;
    const marks = process.env[envVar] || '';
    
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(marks);
  }
  
  // Note: POST won't work with env vars as they're read-only at runtime
  // You'd need to use Vercel CLI to update them: vercel env add MARKS_AGR
  
  return res.status(405).json({ error: 'Method not allowed' });
}
*/

/*
RECOMMENDED SOLUTION 3: Using External Database (Most Reliable)

For production use, connect to a free database service:

1. MongoDB Atlas (free tier)
2. Supabase (free tier) 
3. PlanetScale (free tier)
4. Vercel KV (Redis)

Example with Supabase:

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { subject } = req.query;
    const { data } = await supabase
      .from('marks')
      .select('marks')
      .eq('subject', subject)
      .single();
    
    return res.status(200).send(data?.marks || '');
  }
  
  if (req.method === 'POST') {
    const { subject, marks } = req.body;
    await supabase
      .from('marks')
      .upsert({ subject, marks });
    
    return res.status(200).json({ message: 'Saved' });
  }
}
*/
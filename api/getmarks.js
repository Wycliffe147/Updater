// File: api/getmarks.js
// This should be placed in the /api folder of your Vercel project

export default function handler(req, res) {
  // Enable CORS for Excel to access the API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { subject } = req.query;
  
  if (!subject) {
    return res.status(400).json({ error: 'Subject parameter is required' });
  }
  
  // Valid subjects
  const validSubjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
  
  if (!validSubjects.includes(subject)) {
    return res.status(400).json({ error: 'Invalid subject code' });
  }
  
  // Since we can't access localStorage from the server side,
  // we'll return a simple message for now
  // In a real implementation, you'd fetch this from a database
  
  // For testing purposes, return sample data
  const sampleMarks = {
    'Agr': '85\n92\n78\n90\n88',
    'Bk': '75\n82\n91\n87\n79',
    'Bio': '88\n95\n73\n84\n90',
    'Chem': '92\n78\n85\n91\n86',
    'Chich': '89\n84\n77\n93\n81',
    'Comp': '94\n87\n92\n89\n95',
    'Eng': '83\n90\n76\n88\n85',
    'Geo': '87\n82\n94\n79\n91',
    'Hist': '91\n85\n88\n92\n84',
    'Phy': '86\n93\n81\n87\n89',
    'Math': '95\n88\n92\n85\n90',
    'Sos': '82\n89\n86\n91\n87'
  };
  
  // Return the marks for the requested subject
  const marks = sampleMarks[subject] || '';
  
  // Return as plain text (line-separated marks)
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(marks);
}
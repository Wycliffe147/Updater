// File: api/marks.js
// Uses Vercel Environment Variables for persistent storage

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
    
    // List all subjects with data (for debugging)
    if (action === 'list') {
      const subjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
      const data = {};
      
      subjects.forEach(subj => {
        const envVar = `MARKS_${subj.toUpperCase()}`;
        const marks = process.env[envVar] || '';
        if (marks) {
          data[subj] = marks;
        }
      });
      
      return res.status(200).json({
        message: 'Available subjects with marks',
        data: data
      });
    }
    
    if (!subject) {
      return res.status(400).json({ error: 'Subject parameter is required' });
    }
    
    const validSubjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
    
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject code' });
    }
    
    // Get marks from environment variable (base64 decoded)
    const envVar = `MARKS_${subject.toUpperCase()}`;
    const encodedMarks = process.env[envVar] || '';
    
    let marks = '';
    if (encodedMarks) {
      try {
        // Decode base64 to get original marks
        marks = Buffer.from(encodedMarks, 'base64').toString('utf8');
      } catch (error) {
        // If decoding fails, treat as plain text (backward compatibility)
        marks = encodedMarks;
      }
    }
    
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(marks);
  }
  
  // POST - save marks (returns instructions for manual setup)
  if (req.method === 'POST') {
    const { subject, marks } = req.body;
    
    if (!subject || marks === undefined) {
      return res.status(400).json({ error: 'Subject and marks are required' });
    }
    
    const validSubjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
    
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject code' });
    }
    
    // Environment variables can't be set at runtime via API
    // Return instructions for manual setup
    const envVar = `MARKS_${subject.toUpperCase()}`;
    const encodedMarks = Buffer.from(marks).toString('base64');
    
    return res.status(200).json({ 
      message: 'To save these marks permanently, add this environment variable in Vercel:',
      instructions: {
        variable_name: envVar,
        variable_value: encodedMarks,
        original_marks: marks,
        setup_instructions: [
          '1. Go to your Vercel dashboard',
          '2. Select your project (updater-eight)',
          '3. Go to Settings → Environment Variables',
          `4. Add new variable: ${envVar}`,
          `5. Set value to: ${encodedMarks}`,
          '6. Redeploy your project'
        ],
        cli_command: `vercel env add ${envVar} production`,
        decoded_marks_preview: marks.split('\n').slice(0, 5).join(', ') + (marks.split('\n').length > 5 ? '...' : '')
      }
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
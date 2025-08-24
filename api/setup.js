// File: api/setup.js
// Utility endpoint to help with environment variable setup

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Return setup instructions and current status
    const subjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
    const status = {};
    
    subjects.forEach(subject => {
      const envVar = `MARKS_${subject.toUpperCase()}`;
      const hasData = !!process.env[envVar];
      status[subject] = {
        variable: envVar,
        hasData: hasData,
        previewData: hasData ? 'Data available' : 'No data'
      };
    });
    
    return res.status(200).json({
      message: 'Environment Variables Setup Status',
      status: status,
      instructions: {
        manual_setup: [
          '1. Save marks using the web interface',
          '2. The system will show you the environment variable to create',
          '3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
          '4. Add the variable and redeploy'
        ],
        cli_setup: [
          '1. Install Vercel CLI: npm i -g vercel',
          '2. Link project: vercel link',
          '3. Add variables: vercel env add MARKS_AGR production',
          '4. Deploy: vercel --prod'
        ]
      }
    });
  }
  
  if (req.method === 'POST') {
    // Generate environment variable commands for all subjects
    const { generateAll } = req.body;
    
    if (generateAll) {
      const subjects = ['Agr', 'Bk', 'Bio', 'Chem', 'Chich', 'Comp', 'Eng', 'Geo', 'Hist', 'Phy', 'Math', 'Sos'];
      const sampleMarks = "85\n92\n78\n90\n88\n76\n83\n91\n87\n79";
      
      const commands = subjects.map(subject => {
        const envVar = `MARKS_${subject.toUpperCase()}`;
        const encodedMarks = Buffer.from(sampleMarks).toString('base64');
        return `vercel env add ${envVar} "${encodedMarks}" production`;
      });
      
      return res.status(200).json({
        message: 'Sample environment variable commands generated',
        commands: commands,
        note: 'These commands will set sample marks for all subjects. Run them in your terminal after installing Vercel CLI.',
        sample_marks: sampleMarks
      });
    }
    
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
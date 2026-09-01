import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { readDb, writeDb, addExperience, addBullet, addJob, updateCandidateInfo } from './server/db';
import { extractCVEntities, scoreJobFit, tailorResume } from './server/ai';
import crypto from 'crypto';

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/matrix', (req, res) => {
    const db = readDb();
    res.json(db);
  });

  app.post('/api/upload-cv', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      let text = '';
      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const parsed = await parser.getText();
        text = parsed.text;
      } else {
        text = fs.readFileSync(filePath, 'utf-8'); // Assume text file
      }

      // Extract entities via Gemini
      const entities = await extractCVEntities(text);
      
      // Update DB
      if (entities.candidate_info) {
        updateCandidateInfo(entities.candidate_info);
      }

      if (entities.experiences) {
        const db = readDb();
        for (const exp of entities.experiences) {
            const expId = 'exp_' + crypto.randomUUID();
            db.master_experiences.push({
                experience_id: expId,
                company_canonical: exp.company,
                company_aliases: [exp.company],
                location: exp.location,
                start_date: exp.start_date,
                end_date: exp.end_date,
                role_titles: [exp.title],
            });

            if (exp.bullets) {
                for (const b of exp.bullets) {
                    db.master_bullets.push({
                        bullet_id: 'b_' + crypto.randomUUID(),
                        experience_id: expId,
                        raw_text: b.text,
                        domain_tags: b.domain_tags || [],
                        metrics: b.metrics || [],
                        source_type: 'uploaded_cv',
                        source_file: req.file.originalname,
                        created_at: new Date().toISOString()
                    });
                }
            }
        }
        writeDb(db);
      }

      fs.unlinkSync(filePath); // cleanup
      res.json({ success: true, entities });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/scrape', async (req, res) => {
    const { url, rawText, platform } = req.body;
    try {
      const jobHash = crypto.createHash('sha256').update(url || rawText).digest('hex');
      const job = {
          job_hash: jobHash,
          source_site: platform || 'manual',
          url: url || '',
          description_raw: rawText || 'Extracted via URL...', // simplified
          title: 'Target Job',
          company: 'Target Company',
          location: 'Remote',
          scraped_at: new Date().toISOString(),
          status: 'new'
      };
      
      addJob(job);
      res.json({ success: true, job });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/match', async (req, res) => {
      try {
          const { jdText } = req.body;
          const db = readDb();
          const matchData = await scoreJobFit(jdText, db);
          res.json({ success: true, match: matchData });
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  });

  app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { jdText } = req.body;
        const db = readDb();
        const tailored = await tailorResume(jdText, db);
        res.json({ success: true, document: tailored });
    } catch(e: any) {
        res.status(500).json({ error: e.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

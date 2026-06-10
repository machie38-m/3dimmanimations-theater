import { chromium } from 'playwright';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

const TARGET_DIR = '/home/z/my-project/public/videos';
const BASE_URL = 'https://m1tf04hyde51-d.space-z.ai';

const videos = [
  { url: '/videos/bunny_bar_klee_part1.mp4', name: 'Bunny_Bar_1_Klee.mp4' },
  { url: '/videos/bunny_bar_diona_part2.mp4', name: 'Bunny_Bar_2_Diona.mp4' },
  { url: '/videos/bunny_bar_qiqi_part3.mp4', name: 'Bunny_Bar_3_Qiqi.mp4' },
];

async function downloadVideo(page, videoInfo) {
  const filePath = path.join(TARGET_DIR, videoInfo.name);
  console.log(`Starting download: ${videoInfo.name}`);
  
  // Use the browser context to make the request
  const response = await page.request.get(`${BASE_URL}${videoInfo.url}`, {
    headers: {
      'Range': 'bytes=0-0'
    }
  });
  
  // First check if we can get the file size
  const contentRange = response.headers()['content-range'];
  const totalSize = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
  console.log(`File size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Now download the full file in chunks
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  const fileStream = createWriteStream(filePath);
  
  let downloaded = 0;
  while (downloaded < totalSize) {
    const start = downloaded;
    const end = Math.min(downloaded + CHUNK_SIZE, totalSize) - 1;
    
    const chunkResponse = await page.request.get(`${BASE_URL}${videoInfo.url}`, {
      headers: {
        'Range': `bytes=${start}-${end}`
      }
    });
    
    const buffer = await chunkResponse.body();
    fileStream.write(buffer);
    downloaded += buffer.length;
    
    const progress = ((downloaded / totalSize) * 100).toFixed(1);
    console.log(`  Progress: ${progress}% (${(downloaded / 1024 / 1024).toFixed(1)} MB / ${(totalSize / 1024 / 1024).toFixed(1)} MB)`);
  }
  
  fileStream.end();
  console.log(`Completed: ${videoInfo.name}`);
  return filePath;
}

async function main() {
  await mkdir(TARGET_DIR, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  
  const page = await context.newPage();
  
  // First navigate to the site to establish the session
  console.log('Navigating to site...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  console.log('Page loaded successfully');
  
  const results = [];
  for (const video of videos) {
    try {
      const filePath = await downloadVideo(page, video);
      results.push({ name: video.name, path: filePath, success: true });
    } catch (error) {
      console.error(`Failed to download ${video.name}:`, error.message);
      results.push({ name: video.name, error: error.message, success: false });
    }
  }
  
  await browser.close();
  
  console.log('\n--- Download Summary ---');
  for (const r of results) {
    if (r.success) {
      console.log(`✓ ${r.name} -> ${r.path}`);
    } else {
      console.log(`✗ ${r.name}: ${r.error}`);
    }
  }
}

main().catch(console.error);

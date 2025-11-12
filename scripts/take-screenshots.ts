import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const BASE_URL = 'http://localhost:3000';
const VIEWPORT = { width: 1440, height: 900 };

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function waitForAnimation(page: Page, ms: number = 500): Promise<void> {
  await page.waitForTimeout(ms);
}

async function toggleTheme(page: Page): Promise<void> {
  const themeButton = page.locator('button.theme-toggle').first();
  await themeButton.click();
  await waitForAnimation(page);
}

async function loadExampleSession(page: Page): Promise<void> {
  console.log('📂 Loading example session...');

  // Read the example session file
  const sessionPath = path.join(
    __dirname,
    '..',
    'src',
    'sessions',
    'session-24b09166-f5ee-4841-be79-8f5d004ba9ce.json',
  );
  const sessionData = fs.readFileSync(sessionPath, 'utf-8');

  // Create a temporary file for upload
  const tempFilePath = path.join(__dirname, 'temp-session.json');
  fs.writeFileSync(tempFilePath, sessionData);

  // Upload the file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(tempFilePath);
  await page.waitForTimeout(2000); // Wait for session to load

  // Clean up temp file
  fs.unlinkSync(tempFilePath);
}

async function takeScreenshot(page: Page, filename: string): Promise<void> {
  console.log(`📸 Taking screenshot: ${filename}`);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: false,
  });
}

async function takeScreenshots(): Promise<void> {
  console.log('🚀 Starting screenshot generation...');

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: VIEWPORT,
    });
    const page = await context.newPage();

    // Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await waitForAnimation(page, 1000);

    // Screenshot 1: Home - Light Theme
    await takeScreenshot(page, 'home-light.png');

    // Screenshot 2: Home - Dark Theme
    await toggleTheme(page);
    await takeScreenshot(page, 'home-dark.png');

    // Load the example session
    await loadExampleSession(page);

    // Screenshot 3: Session Viewer - Dark Theme (already in dark mode)
    await takeScreenshot(page, 'session-dark.png');

    // Screenshot 4: Session Viewer - Light Theme
    await toggleTheme(page);
    await takeScreenshot(page, 'session-light.png');

    console.log('✅ All screenshots generated successfully!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
takeScreenshots().catch((error: Error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

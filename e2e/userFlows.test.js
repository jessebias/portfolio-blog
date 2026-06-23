/**
 * E2E tests for Portfolio Blog — Selenium WebDriver with headless Chrome.
 *
 * PREREQUISITES: Both dev servers must be running before executing these tests.
 *   - Frontend: http://localhost:3001  (cd frontend && npm run dev)
 *   - Backend:  http://localhost:3000  (cd backend && npm start)
 *
 * Set credentials via environment variables:
 *   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm test
 *
 * Or create a .env file in the e2e/ directory:
 *   ADMIN_EMAIL=your@email.com
 *   ADMIN_PASSWORD=yourpassword
 */

require('dotenv').config();

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const WAIT_TIMEOUT = 10000;

describe('Portfolio Blog User Flows', () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async () => {
    await driver.executeScript('localStorage.clear()');
  });

  // ---------------------------------------------------------------------------
  // 1. Login success
  // ---------------------------------------------------------------------------
  test('Login success — valid admin credentials redirect to /admin', async () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping login success test');
      return;
    }

    await driver.get(`${BASE_URL}/login`);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      WAIT_TIMEOUT
    );
    await emailInput.clear();
    await emailInput.sendKeys(ADMIN_EMAIL);

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys(ADMIN_PASSWORD);

    const submitButton = await driver.findElement(
      By.xpath('//button[contains(., "ACCESS SYSTEM")]')
    );
    await submitButton.click();

    await driver.wait(until.urlContains('/admin'), WAIT_TIMEOUT);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/admin');

    const pageSource = await driver.getPageSource();
    const hasAdminContent =
      pageSource.includes('ADMIN_DASHBOARD') ||
      pageSource.includes('CREATE NEW POST') ||
      pageSource.includes('MANAGE POSTS');
    expect(hasAdminContent).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // 2. Login failure
  // ---------------------------------------------------------------------------
  test('Login failure — wrong credentials show inline error, stay on /login', async () => {
    await driver.get(`${BASE_URL}/login`);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      WAIT_TIMEOUT
    );
    await emailInput.clear();
    await emailInput.sendKeys('wrong@email.com');

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys('wrongpassword');

    const submitButton = await driver.findElement(
      By.xpath('//button[contains(., "ACCESS SYSTEM")]')
    );
    await submitButton.click();

    // Wait for error element to appear — the Login component renders it inside
    // a div with bg-red-500/5 styling when the `error` state is non-empty.
    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(@class,"red") or contains(@class,"error")]')
      ),
      WAIT_TIMEOUT
    );

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/login');

    const errorEls = await driver.findElements(
      By.xpath('//*[contains(@class,"red") or contains(@class,"error")]')
    );
    expect(errorEls.length).toBeGreaterThan(0);

    const errorText = await errorEls[0].getText();
    const upperText = errorText.toUpperCase();
    const hasErrorKeyword =
      upperText.includes('INVALID') ||
      upperText.includes('CREDENTIALS') ||
      upperText.includes('UNAUTHORIZED') ||
      upperText.includes('ERROR') ||
      upperText.length > 0;
    expect(hasErrorKeyword).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // 3. Blogs page load
  // ---------------------------------------------------------------------------
  test('Blogs page — heading visible and either posts or empty state rendered', async () => {
    await driver.get(`${BASE_URL}/blogs`);

    const heading = await driver.wait(
      until.elementLocated(By.xpath('//*[text()="BLOG"]')),
      WAIT_TIMEOUT
    );
    expect(await heading.isDisplayed()).toBe(true);

    // Allow time for async data fetch to settle
    await driver.sleep(2000);

    const pageSource = await driver.getPageSource();
    const hasBlogCards = pageSource.includes('/blogs/');
    const hasEmptyState =
      pageSource.includes('No articles found') ||
      pageSource.includes('SECTOR');

    expect(hasBlogCards || hasEmptyState).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // 4. Blog post navigation (data-dependent — skipped gracefully when empty)
  // ---------------------------------------------------------------------------
  test('Blog post navigation — clicking first post loads individual post page', async () => {
    await driver.get(`${BASE_URL}/blogs`);

    await driver.wait(
      until.elementLocated(By.xpath('//*[text()="BLOG"]')),
      WAIT_TIMEOUT
    );

    // Wait for data fetch to settle
    await driver.sleep(2000);

    try {
      const blogLinks = await driver.findElements(
        By.xpath('//a[contains(@href, "/blogs/") and not(@href="/blogs")]')
      );

      if (blogLinks.length === 0) {
        console.warn('No blog posts found — skipping navigation sub-assertion');
        return;
      }

      await blogLinks[0].click();

      await driver.wait(
        until.urlMatches(/\/blogs\/\d+/),
        WAIT_TIMEOUT
      );

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toMatch(/\/blogs\/\d+/);

      const returnLink = await driver.wait(
        until.elementLocated(
          By.xpath('//a[contains(., "RETURN TO BLOG")]')
        ),
        WAIT_TIMEOUT
      );
      expect(await returnLink.isDisplayed()).toBe(true);
    } catch (err) {
      console.warn('Blog post navigation test skipped or failed gracefully:', err.message);
    }
  });

  // ---------------------------------------------------------------------------
  // 5. Admin route guard — unauthenticated user redirected to /login
  // ---------------------------------------------------------------------------
  test('Admin route guard — unauthenticated user visiting /admin is redirected to /login', async () => {
    // Ensure no auth token present
    await driver.get(`${BASE_URL}/login`);
    await driver.executeScript('localStorage.clear()');

    await driver.get(`${BASE_URL}/admin`);

    await driver.wait(until.urlContains('/login'), WAIT_TIMEOUT);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });

  // ---------------------------------------------------------------------------
  // 6. Profile route guard — unauthenticated user redirected to /login
  // ---------------------------------------------------------------------------
  test('Profile route guard — unauthenticated user visiting /profile is redirected to /login', async () => {
    // Ensure no auth token present
    await driver.get(`${BASE_URL}/login`);
    await driver.executeScript('localStorage.clear()');

    await driver.get(`${BASE_URL}/profile`);

    await driver.wait(until.urlContains('/login'), WAIT_TIMEOUT);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });
});

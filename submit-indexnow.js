#!/usr/bin/env node
/*
 * submit-indexnow.js — Ping IndexNow after deploying Restcalc.
 *
 * What it does:
 *   1. Reads the IndexNow key from ./indexnow.txt
 *   2. Reads all <loc> URLs from ./sitemap.xml
 *   3. POSTs them to https://api.indexnow.org/indexnow
 *
 * IndexNow tells Bing (and other engines) "these pages are live / updated"
 * without waiting for the crawler to rediscover them — exactly the early
 * feedback loop described in the Lanxingkong / Gefei growth write-up.
 *
 * Usage:
 *   node submit-indexnow.js                 # submit to default host
 *   node submit-indexnow.js --dry-run       # print URLs, do NOT ping
 *   HOST=restcalc.com node submit-indexnow.js   # submit for a custom domain
 *
 * Note: when you switch to a custom domain, update HOST (and the key file
 * stays the same — it is served at both www.rest-calc.com and the new domain).
 */

const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || 'www.rest-calc.com';
const KEY_FILE = path.join(__dirname, 'indexnow.txt');
const SITEMAP = path.join(__dirname, 'sitemap.xml');
const DRY_RUN = process.argv.includes('--dry-run');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function fail(msg) {
  console.error('[indexnow] ' + msg);
  process.exit(1);
}

function readKey() {
  if (!fs.existsSync(KEY_FILE)) fail('indexnow.txt not found at ' + KEY_FILE);
  return fs.readFileSync(KEY_FILE, 'utf8').trim();
}

function readUrls() {
  if (!fs.existsSync(SITEMAP)) fail('sitemap.xml not found at ' + SITEMAP);
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
  if (!urls.length) fail('no <loc> URLs found in sitemap.xml');
  return urls;
}

async function main() {
  const key = readKey();
  const keyLocation = `https://${HOST}/indexnow.txt`;
  const urlList = readUrls();

  console.log(`[indexnow] host=${HOST}`);
  console.log(`[indexnow] keyLocation=${keyLocation}`);
  console.log(`[indexnow] urls=${urlList.length}`);

  if (DRY_RUN) {
    console.log('[indexnow] --dry-run: would submit the following URLs:');
    urlList.forEach((u) => console.log('  - ' + u));
    return;
  }

  const payload = { host: HOST, key, keyLocation, urlList };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    if (res.ok) {
      console.log(`[indexnow] OK (${res.status}) — submitted ${urlList.length} URLs`);
    } else {
      console.error(`[indexnow] FAILED (${res.status}): ${body}`);
      process.exit(2);
    }
  } catch (e) {
    console.error('[indexnow] network error: ' + e.message);
    process.exit(3);
  }
}

main();

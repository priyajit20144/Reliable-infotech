#!/usr/bin/env node

/**
 * Cross-platform utility to free development ports (5000, 5173, etc.)
 * Prevents "EADDRINUSE: address already in use" errors and orphaned processes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Extract PORT from .env if present
function getEnvPort() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'server', '.env'),
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '..', 'server', '.env'),
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const match = fs.readFileSync(p, 'utf-8').match(/^PORT\s*=\s*(\d+)/m);
      if (match) return parseInt(match[1], 10);
    }
  }
  return 5000;
}

const defaultPorts = Array.from(new Set([getEnvPort(), 5173, 5174]));
const targetPorts = process.argv.slice(2).length > 0
  ? process.argv.slice(2).map(p => parseInt(p, 10)).filter(Boolean)
  : defaultPorts;

function killPid(pid) {
  if (!pid || pid === process.pid || pid === process.ppid) return false;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      try {
        process.kill(pid, 'SIGTERM');
      } catch {}
      try {
        process.kill(pid, 'SIGKILL');
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
}

function freePort(port) {
  let killed = 0;
  if (process.platform === 'win32') {
    try {
      const output = execSync('netstat -ano -p tcp', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes(`:${port} `) && line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parseInt(parts[parts.length - 1], 10);
          if (pid && killPid(pid)) killed++;
        }
      }
    } catch {}
  } else {
    // Linux / macOS via lsof
    try {
      const output = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const pids = output.split('\n').map(p => parseInt(p.trim(), 10)).filter(Boolean);
      for (const pid of pids) {
        if (killPid(pid)) killed++;
      }
    } catch {}

    // Fallback via fuser
    if (killed === 0) {
      try {
        execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
      } catch {}
    }
  }

  if (killed > 0) {
    console.log(`[DevCraft Port Manager] Cleaned up ${killed} stale process(es) on port ${port}.`);
  }
}

function run() {
  for (const port of targetPorts) {
    freePort(port);
  }
}

run();

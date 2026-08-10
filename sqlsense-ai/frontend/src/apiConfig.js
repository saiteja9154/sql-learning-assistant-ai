// Dynamic API configuration with automatic backend port detection
let cachedApiUrl = null;

/**
 * Dynamically detects the backend API base URL by checking candidate ports
 * and hostnames, or resolving relative to the current location.
 */
export async function getApiUrl() {
  if (cachedApiUrl) return cachedApiUrl;

  const protocol = window.location.protocol || 'http:';
  const hostname = window.location.hostname || 'localhost';

  // 1. If an environment variable is configured via Vite, prioritize it
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    cachedApiUrl = import.meta.env.VITE_API_URL;
    return cachedApiUrl;
  }

  // 2. If the frontend is served directly by the backend (production / static hosting)
  // we just reuse the origin and port of the current page.
  if (window.location.port && !['5173', '3000'].includes(window.location.port)) {
    cachedApiUrl = `${protocol}//${hostname}:${window.location.port}`;
    return cachedApiUrl;
  }

  // 3. Proactively probe backend candidate ports to auto-detect where FastAPI is running
  const candidatePorts = [8001, 8000, 8002];
  
  for (const port of candidatePorts) {
    // Try the current hostname
    try {
      const url = `${protocol}//${hostname}:${port}`;
      // Use AbortSignal to prevent hanging requests on inactive ports
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      
      const res = await fetch(`${url}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') {
          cachedApiUrl = url;
          console.log(`[SQLSense AI] Auto-detected backend at ${url}`);
          return url;
        }
      }
    } catch (e) {
      // Ignore and check next port/hostname
    }

    // If hostname is "localhost", also check "127.0.0.1" (and vice versa) for safety
    const altHostname = hostname === 'localhost' ? '127.0.0.1' : 'localhost';
    try {
      const url = `${protocol}//${altHostname}:${port}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      
      const res = await fetch(`${url}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') {
          cachedApiUrl = url;
          console.log(`[SQLSense AI] Auto-detected backend at ${url}`);
          return url;
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // 4. Default fallback: point to the active backend port 8001
  cachedApiUrl = `${protocol}//${hostname}:8001`;
  return cachedApiUrl;
}

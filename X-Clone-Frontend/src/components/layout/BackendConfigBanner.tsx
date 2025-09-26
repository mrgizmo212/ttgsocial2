export function BackendConfigBanner() {
  return (
    <div className="w-full bg-red-600/80 text-white p-3 text-sm">
      <p className="font-semibold">Backend not configured</p>
      <p>
        Set VITE_API_URL in .env.local to your backend base URL, then restart the dev server.
      </p>
    </div>
  );
}



Local run (PowerShell):

1) Create .env
   - Copy .env.example to .env and set JWT_SECRET

2) Create venv and install deps
   - python -m venv .venv
   - .\.venv\Scripts\Activate.ps1
   - pip install -r requirements.txt

3) Start server on 8080
   - uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload

4) Configure frontend
   - Set VITE_API_URL=http://localhost:8080



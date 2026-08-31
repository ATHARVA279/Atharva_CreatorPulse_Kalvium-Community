from backend.app.main import app

# Vercel serverless function handler
# Export the ASGI app for Vercel
handler = app


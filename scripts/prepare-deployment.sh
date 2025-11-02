#!/bin/bash
# Pre-deployment preparation script

echo "🚀 Preparing Adappt for Deployment..."

# Check if .env files exist
echo "📋 Checking environment files..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Copying from .env.example..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "Please create backend/.env manually"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found. Copying from .env.example..."
    cp frontend/.env.example frontend/.env 2>/dev/null || echo "Please create frontend/.env manually"
fi

if [ ! -f "ml/.env" ]; then
    echo "⚠️  ml/.env not found. Copying from .env.example..."
    cp ml/.env.example ml/.env 2>/dev/null || echo "Please create ml/.env manually"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install --production=false && cd ..
cd frontend && npm install && cd ..
cd ml && pip install -r requirements.txt && cd ..

echo "✅ Preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review and update .env files with production values"
echo "2. Run: git init"
echo "3. Run: git add ."
echo "4. Run: git commit -m 'Initial commit'"
echo "5. Create GitHub repository and push"
echo ""
echo "🔐 Security reminders:"
echo "- Change JWT_SECRET in backend/.env"
echo "- Set DEMO_MODE=false for production"
echo "- Update CORS_ORIGIN with production URLs"


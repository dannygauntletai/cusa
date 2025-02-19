#!/usr/bin/env bash

# Exit on error
set -e

# Function to cleanup background processes on script exit
cleanup() {
    echo "Cleaning up..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

# Function to check if a port is in use and kill the process
kill_port() {
    local port=$1
    if lsof -i :$port > /dev/null; then
        echo "Port $port is in use. Killing process..."
        lsof -ti :$port | xargs kill -9
        sleep 1
    fi
}

# Function to handle Supabase startup
start_supabase() {
    # Check if Supabase is already running
    if supabase status >/dev/null 2>&1; then
        echo "Supabase is already running"
        return 0
    fi

    echo "Starting Supabase..."
    
    # Stop containers only if they exist and are not running properly
    supabase stop --project-id test 2>/dev/null || true
    supabase stop --project-id cusa 2>/dev/null || true
    
    # Update project_id in config.toml if needed
    if ! grep -q 'project_id = "cusa"' supabase/config.toml; then
        echo "Updating Supabase config..."
        sed -i.bak 's/project_id = "test"/project_id = "cusa"/' supabase/config.toml
        rm -f supabase/config.toml.bak
    fi
    
    supabase start
    
    # Verify Supabase started successfully
    if ! supabase status >/dev/null 2>&1; then
        echo "Error: Failed to start Supabase"
        exit 1
    fi
}

# Check for required tools
command -v uv >/dev/null 2>&1 || { echo "Error: uv is required but not installed. Install with 'pip install uv'"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo "Error: supabase CLI is required but not installed. Install with 'brew install supabase/tap/supabase'"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Error: npm is required but not installed. Please install Node.js"; exit 1; }

# Setup Python environment only if it doesn't exist or requirements changed
cd backend
if [ ! -d ".venv" ] || [ ! -f ".venv/.requirements-installed" ] || [ pyproject.toml -nt ".venv/.requirements-installed" ]; then
    echo "Setting up Python environment..."
    rm -rf .venv || true
    uv venv
    source .venv/bin/activate
    uv pip install -e .
    uv sync --all-groups --dev
    touch .venv/.requirements-installed
else
    echo "Python environment is up to date"
    source .venv/bin/activate
fi

# Start Supabase
cd ..
start_supabase

# Update environment variables
echo "Updating environment variables..."
bash scripts/update-env.sh

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating default .env file..."
    cat > .env << EOL
ENVIRONMENT=local
PROJECT_NAME=CUSA
FIRST_SUPERUSER=test@test.com
FIRST_SUPERUSER_PASSWORD=test123
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
EOL
fi

# Kill any processes using our ports
kill_port 8000  # Backend port
kill_port 5173  # Frontend port

# Start Backend
echo "Starting Backend..."
cd backend
PYTHONPATH=$PYTHONPATH:$(pwd) python -m app.utils.test_pre_start
uvicorn app.main:app --reload --port 8000 &

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
if [ ! -f "node_modules/.installed" ] || [ package.json -nt "node_modules/.installed" ]; then
    npm install
    touch node_modules/.installed
fi
npm run dev &

# Print service URLs
echo "
Services started:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Supabase Studio: http://localhost:54323
"

# Wait for all background processes
wait 
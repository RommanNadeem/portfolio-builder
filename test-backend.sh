#!/bin/bash

# Test Backend Connectivity Script
# Run this to verify your Railway backend is working

echo "🧪 Testing Railway Backend..."
echo ""

BACKEND_URL="https://portfoliobuilder-backend-production.up.railway.app"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "📊 Test 1: Health Check"
echo "GET $BACKEND_URL/health"
echo ""

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health Check: PASSED${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ Health Check: FAILED (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
    exit 1
fi

echo ""
echo "---"
echo ""

# Test 2: Root Endpoint
echo "📊 Test 2: Root Endpoint"
echo "GET $BACKEND_URL/"
echo ""

ROOT_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/")
HTTP_CODE=$(echo "$ROOT_RESPONSE" | tail -n1)
BODY=$(echo "$ROOT_RESPONSE" | head -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Root Endpoint: PASSED${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ Root Endpoint: FAILED (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi

echo ""
echo "---"
echo ""

# Test 3: Generate Copy (requires valid data)
echo "📊 Test 3: Generate Taglines"
echo "POST $BACKEND_URL/api/generate-copy"
echo ""

COPY_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/generate-copy" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tagline",
    "context": {
      "name": "Test User",
      "role": "Software Engineer",
      "companies": ["Google", "Meta"]
    }
  }')

HTTP_CODE=$(echo "$COPY_RESPONSE" | tail -n1)
BODY=$(echo "$COPY_RESPONSE" | head -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Generate Copy: PASSED${NC}"
    echo "Response: $(echo $BODY | jq -r '.data.taglines[0] // .data' 2>/dev/null || echo $BODY)"
else
    echo -e "${YELLOW}⚠️  Generate Copy: Status $HTTP_CODE${NC}"
    echo "Response: $BODY"
fi

echo ""
echo "---"
echo ""

# Summary
echo "📋 Summary"
echo ""
echo -e "${GREEN}✅ Backend is operational!${NC}"
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Status: Online and responding"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the frontend"
echo "2. Visit http://localhost:3000/test-ai to test in browser"
echo "3. Try uploading a resume at http://localhost:3000/onboarding-v2/start"
echo ""


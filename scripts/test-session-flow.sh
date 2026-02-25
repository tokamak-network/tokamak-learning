#!/bin/bash

# Session Flow Test Script
# This script simulates the user flow to reproduce the session issue

echo "========================================"
echo "Session Flow Test"
echo "========================================"

BASE_URL="${1:-http://localhost:3000}"
CHALLENGE_ID="tutorial-ui-basics"

echo ""
echo "Testing against: $BASE_URL"
echo "Challenge ID: $CHALLENGE_ID"
echo ""

# Step 1: PUT /api/vulnerability/run to create session
echo "Step 1: Creating session (PUT /api/vulnerability/run)..."
RESPONSE=$(curl -s -X PUT "$BASE_URL/api/vulnerability/run" \
  -H "Content-Type: application/json" \
  -d "{\"challengeId\": \"$CHALLENGE_ID\"}")

echo "Response: $RESPONSE"

# Extract sessionId
SESSION_ID=$(echo $RESPONSE | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "Extracted sessionId: $SESSION_ID"

if [ -z "$SESSION_ID" ]; then
  echo "ERROR: Failed to get sessionId"
  exit 1
fi

# Step 2: POST /api/vulnerability/verify to call contract function
echo ""
echo "Step 2: Calling contract function (POST /api/vulnerability/verify)..."
RESPONSE2=$(curl -s -X POST "$BASE_URL/api/vulnerability/verify" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"$SESSION_ID\", \"action\": \"call\", \"payload\": {\"contractName\": \"SimpleCounter\", \"functionName\": \"count\"}}")

echo "Response: $RESPONSE2"

# Check if session was found
if echo "$RESPONSE2" | grep -q "Session not found"; then
  echo ""
  echo "========================================"
  echo "ERROR: Session not found!"
  echo "This confirms the bug."
  echo "========================================"
  exit 1
else
  echo ""
  echo "========================================"
  echo "SUCCESS: Session was found and call executed."
  echo "========================================"
  exit 0
fi
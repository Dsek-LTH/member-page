#!/usr/bin/env bash
# Run source setenv.sh from project root to set environment variables

# Show env vars
grep -v '^#' .env

# Export env vars
export $(grep -v '^#' .env | xargs)
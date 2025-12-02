# Ping Pong Tournament Scheduler - Debugging Challenge

## Overview

You’ve been put in charge of organizing and scheduling a ping pong tournament for your coworkers. You’re given a partially implemented TypeScript module that’s supposed to handle match scheduling and calculate player standings. The problem is that the module is buggy and only partially works. Your job is to find and fix the issues, complete the missing logic, and get all tests to pass.
## Requirements

The implementation should:

1. Take a list of players and generate a round robin schedule of matches.
2. Each pair of players should play exactly one match.
3. A player must never play themselves.
4. Matches should default to best of 3 games unless configured otherwise.
5. You can compute simple standings from played matches: wins and losses per player.

## Your Task

You must:

1. Find and fix bugs in the implementation.
2. Make all tests pass.
3. Prefer fixing implementation rather than changing tests, unless the test clearly contradicts the written requirements.
4. Avoid rewriting everything from scratch. You should patch what is there.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Compile TypeScript:
   ```bash
   npx tsc
   ```

Good luck!


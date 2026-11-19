# 0002 — The audit row is written by the action that makes the change

**Status:** accepted · **Date:** November 2026

## Context

Two ways to keep an audit log honest:

1. Database triggers on `listings`, `users` and `agents` that write an
   `audit_logs` row on every update.
2. The server action that performs the change also writes the audit row.

## Decision

Option 2. `recordAudit()` is called by the same action, immediately after the
update, with the previous status and the new one. Every admin mutation goes
through it: approve, reject, request changes, verify agent, reject agent, change
role, archive, restore.

## Consequences

**Good**

- The row can carry things a trigger cannot know: who was signed in, what reason
  they typed, and the name of the target as it was at that moment.
- The audit log explains *why* ("Changes requested: photos are stock images"),
  not just that a column changed.
- Nothing is written for unrelated updates (seed scripts, backfills), so the log
  stays readable.

**Bad**

- The action and the log are two statements, not one transaction. A crash between
  them loses the log entry for a change that happened. The window is
  milliseconds and the failure surfaces as a 500, but it is a real gap.
- A new action can forget to call `recordAudit`, and only review catches it.
  Triggers would not.

## Why not both

Triggers plus action-level logging would double-write and then need
de-duplication. If the audit log becomes a compliance requirement rather than a
product feature, the right move is to wrap the update and the log insert in one
`prisma.$transaction` inside each action — the current shape already makes that a
local change.

## Also decided here

Audit rows are append-only in the UI: there is no delete action, and the admin
list view has no destructive controls. Rows created during review testing were
left in the log rather than removed, because deleting audit history to tidy a
demo defeats the point of having it.

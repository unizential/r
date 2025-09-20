# ADR 0001: SLOs and Performance Budgets

## Status
Accepted

## Context
Manus Engine requires clear performance targets and reliability guarantees for Council sessions and supporting services.

## Decision

- Council synthesis latency SLOs:
  - p50 < 5s
  - p95 < 10s
- Availability SLO: 99.9%
- Max concurrent councils: >= 10
- Agent timeout handling: graceful with audit trail
- Error budget: 0.1% monthly downtime

## Rationale
Targets align with usability goals and platform constraints for typical Roblox projects.

## Consequences
- CI includes perf smoke checks
- Observability dashboards track latency and availability
- Incidents consume error budget; slowdowns trigger alerts

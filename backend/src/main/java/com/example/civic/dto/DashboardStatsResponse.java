package com.example.civic.dto;

public class DashboardStatsResponse {

    private long total;
    private long submitted;
    private long underReview;
    private long assigned;
    private long inProgress;
    private long resolved;
    private long closed;
    private long pending; // submitted + underReview

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long total, long submitted, long underReview, long assigned, long inProgress, long resolved, long closed) {
        this.total = total;
        this.submitted = submitted;
        this.underReview = underReview;
        this.assigned = assigned;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.closed = closed;
        this.pending = submitted + underReview;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getSubmitted() {
        return submitted;
    }

    public void setSubmitted(long submitted) {
        this.submitted = submitted;
    }

    public long getUnderReview() {
        return underReview;
    }

    public void setUnderReview(long underReview) {
        this.underReview = underReview;
    }

    public long getAssigned() {
        return assigned;
    }

    public void setAssigned(long assigned) {
        this.assigned = assigned;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }

    public long getClosed() {
        return closed;
    }

    public void setClosed(long closed) {
        this.closed = closed;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }
}

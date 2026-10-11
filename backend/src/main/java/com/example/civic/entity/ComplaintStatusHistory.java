package com.example.civic.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private ComplaintStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private ComplaintStatus newStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(length = 1000)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ComplaintStatusHistory() {
    }

    public ComplaintStatusHistory(Complaint complaint, ComplaintStatus oldStatus, ComplaintStatus newStatus, User changedBy, String remarks) {
        this.complaint = complaint;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.remarks = remarks;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Complaint getComplaint() {
        return complaint;
    }

    public void setComplaint(Complaint complaint) {
        this.complaint = complaint;
    }

    public ComplaintStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(ComplaintStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public ComplaintStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ComplaintStatus newStatus) {
        this.newStatus = newStatus;
    }

    public User getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(User changedBy) {
        this.changedBy = changedBy;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

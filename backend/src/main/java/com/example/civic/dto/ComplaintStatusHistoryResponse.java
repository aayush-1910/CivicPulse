package com.example.civic.dto;

import com.example.civic.entity.ComplaintStatus;
import java.time.LocalDateTime;

public class ComplaintStatusHistoryResponse {

    private Long id;
    private ComplaintStatus oldStatus;
    private ComplaintStatus newStatus;
    private String changedByName;
    private String remarks;
    private LocalDateTime createdAt;

    public ComplaintStatusHistoryResponse() {
    }

    public ComplaintStatusHistoryResponse(Long id, ComplaintStatus oldStatus, ComplaintStatus newStatus, String changedByName, String remarks, LocalDateTime createdAt) {
        this.id = id;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedByName = changedByName;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getChangedByName() {
        return changedByName;
    }

    public void setChangedByName(String changedByName) {
        this.changedByName = changedByName;
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

package com.example.civic.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String assignedOfficer;

    private String remarks;

    public AssignmentRequest() {
    }

    public AssignmentRequest(Long departmentId, String assignedOfficer, String remarks) {
        this.departmentId = departmentId;
        this.assignedOfficer = assignedOfficer;
        this.remarks = remarks;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(String assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

package com.example.civic.dto;

import com.example.civic.entity.Complaint;
import com.example.civic.entity.ComplaintStatus;
import com.example.civic.entity.Priority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ComplaintResponse {

    private Long id;
    private String complaintNumber;
    private Long userId;
    private String citizenName;
    private String citizenEmail;
    private String citizenPhone;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String imageUrl;
    private String address;
    private Double latitude;
    private Double longitude;
    private Priority priority;
    private ComplaintStatus status;
    private Long departmentId;
    private String departmentName;
    private String assignedOfficer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<ComplaintStatusHistoryResponse> history = new ArrayList<>();

    public ComplaintResponse() {
    }

    public static ComplaintResponse fromEntity(Complaint c) {
        ComplaintResponse dto = new ComplaintResponse();
        dto.setId(c.getId());
        dto.setComplaintNumber(c.getComplaintNumber());
        if (c.getUser() != null) {
            dto.setUserId(c.getUser().getId());
            dto.setCitizenName(c.getUser().getName());
            dto.setCitizenEmail(c.getUser().getEmail());
            dto.setCitizenPhone(c.getUser().getPhone());
        }
        if (c.getCategory() != null) {
            dto.setCategoryId(c.getCategory().getId());
            dto.setCategoryName(c.getCategory().getName());
        }
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setImageUrl(c.getImageUrl());
        dto.setAddress(c.getAddress());
        dto.setLatitude(c.getLatitude());
        dto.setLongitude(c.getLongitude());
        dto.setPriority(c.getPriority());
        dto.setStatus(c.getStatus());
        if (c.getAssignedDepartment() != null) {
            dto.setDepartmentId(c.getAssignedDepartment().getId());
            dto.setDepartmentName(c.getAssignedDepartment().getName());
        }
        dto.setAssignedOfficer(c.getAssignedOfficer());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComplaintNumber() {
        return complaintNumber;
    }

    public void setComplaintNumber(String complaintNumber) {
        this.complaintNumber = complaintNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getCitizenEmail() {
        return citizenEmail;
    }

    public void setCitizenEmail(String citizenEmail) {
        this.citizenEmail = citizenEmail;
    }

    public String getCitizenPhone() {
        return citizenPhone;
    }

    public void setCitizenPhone(String citizenPhone) {
        this.citizenPhone = citizenPhone;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(String assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public List<ComplaintStatusHistoryResponse> getHistory() {
        return history;
    }

    public void setHistory(List<ComplaintStatusHistoryResponse> history) {
        this.history = history;
    }
}

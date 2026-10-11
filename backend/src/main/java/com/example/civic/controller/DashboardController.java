package com.example.civic.controller;

import com.example.civic.dto.DashboardStatsResponse;
import com.example.civic.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
public class DashboardController {

    private final ComplaintService complaintService;

    public DashboardController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<DashboardStatsResponse> getStatistics() {
        return ResponseEntity.ok(complaintService.getDashboardStats());
    }
}

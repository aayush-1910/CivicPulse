package com.example.civic.controller;

import com.example.civic.dto.*;
import com.example.civic.entity.ComplaintStatus;
import com.example.civic.entity.Priority;
import com.example.civic.entity.Role;
import com.example.civic.entity.User;
import com.example.civic.service.AuthService;
import com.example.civic.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final AuthService authService;

    public ComplaintController(ComplaintService complaintService, AuthService authService) {
        this.complaintService = complaintService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {

        User currentUser = authService.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            return ResponseEntity.ok(complaintService.getComplaintsForCitizen(currentUser));
        } else {
            return ResponseEntity.ok(complaintService.getAllComplaints(status, categoryId, priority, search));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(complaintService.getComplaintById(id, currentUser));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @ModelAttribute ComplaintRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        User currentUser = authService.getCurrentUser();
        ComplaintResponse response = complaintService.createComplaint(request, image, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ComplaintResponse> createComplaintJson(
            @Valid @RequestBody ComplaintRequest request) {

        User currentUser = authService.getCurrentUser();
        ComplaintResponse response = complaintService.createComplaint(request, null, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {

        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(complaintService.updateStatus(id, request, currentUser));
    }

    @PutMapping("/{id}/priority")
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<ComplaintResponse> updatePriority(
            @PathVariable Long id,
            @Valid @RequestBody PriorityUpdateRequest request) {

        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(complaintService.updatePriority(id, request, currentUser));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {

        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(complaintService.assignComplaint(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}

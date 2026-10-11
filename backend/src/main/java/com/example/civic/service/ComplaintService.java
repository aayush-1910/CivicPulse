package com.example.civic.service;

import com.example.civic.dto.*;
import com.example.civic.entity.*;
import com.example.civic.repository.CategoryRepository;
import com.example.civic.repository.ComplaintRepository;
import com.example.civic.repository.ComplaintStatusHistoryRepository;
import com.example.civic.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintStatusHistoryRepository historyRepository,
                            CategoryRepository categoryRepository,
                            DepartmentRepository departmentRepository,
                            FileStorageService fileStorageService) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
        this.fileStorageService = fileStorageService;
    }

    private synchronized String generateComplaintNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + new Random().nextInt(9000);
        return "CMP-" + datePrefix + "-" + rand;
    }

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, MultipartFile image, User currentUser) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.storeFile(image);
        }

        Complaint complaint = new Complaint();
        complaint.setComplaintNumber(generateComplaintNumber());
        complaint.setUser(currentUser);
        complaint.setCategory(category);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setImageUrl(imageUrl);
        complaint.setAddress(request.getAddress());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setPriority(Priority.MEDIUM);
        complaint.setStatus(ComplaintStatus.SUBMITTED);

        Complaint saved = complaintRepository.save(complaint);

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                null,
                ComplaintStatus.SUBMITTED,
                currentUser,
                "Complaint lodged by citizen"
        );
        historyRepository.save(history);

        ComplaintResponse response = ComplaintResponse.fromEntity(saved);
        response.getHistory().add(new ComplaintStatusHistoryResponse(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                currentUser.getName(),
                history.getRemarks(),
                history.getCreatedAt()
        ));
        return response;
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long id, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + id));

        if (currentUser.getRole() == Role.ROLE_CITIZEN && !complaint.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to view this complaint");
        }

        ComplaintResponse response = ComplaintResponse.fromEntity(complaint);
        List<ComplaintStatusHistoryResponse> historyResponses = historyRepository
                .findByComplaintOrderByCreatedAtAsc(complaint)
                .stream()
                .map(h -> new ComplaintStatusHistoryResponse(
                        h.getId(),
                        h.getOldStatus(),
                        h.getNewStatus(),
                        h.getChangedBy() != null ? h.getChangedBy().getName() : "System",
                        h.getRemarks(),
                        h.getCreatedAt()
                ))
                .collect(Collectors.toList());

        response.setHistory(historyResponses);
        return response;
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsForCitizen(User currentUser) {
        List<Complaint> complaints = complaintRepository.findByUserOrderByCreatedAtDesc(currentUser);
        if (complaints.isEmpty()) return List.of();

        Map<Long, List<ComplaintStatusHistory>> historyByComplaint = historyRepository
                .findByComplaintInOrderByCreatedAtAsc(complaints)
                .stream()
                .collect(Collectors.groupingBy(history -> history.getComplaint().getId()));

        return complaints.stream().map(complaint -> {
            ComplaintResponse response = ComplaintResponse.fromEntity(complaint);
            response.setHistory(historyByComplaint.getOrDefault(complaint.getId(), List.of())
                    .stream().map(this::toHistoryResponse).collect(Collectors.toList()));
            return response;
        }).collect(Collectors.toList());
    }

    private ComplaintStatusHistoryResponse toHistoryResponse(ComplaintStatusHistory history) {
        return new ComplaintStatusHistoryResponse(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getChangedBy() != null ? history.getChangedBy().getName() : "System",
                history.getRemarks(),
                history.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints(ComplaintStatus status, Long categoryId, Priority priority, String search) {
        List<Complaint> list;
        if (status != null || categoryId != null || priority != null || (search != null && !search.isBlank())) {
            String sanitizedSearch = (search != null && !search.isBlank()) ? search.trim() : null;
            list = complaintRepository.findWithFilters(status, categoryId, priority, sanitizedSearch);
        } else {
            list = complaintRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(ComplaintResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, StatusUpdateRequest request, User authorityUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + id));

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(request.getStatus());

        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        Complaint saved = complaintRepository.save(complaint);

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                oldStatus,
                request.getStatus(),
                authorityUser,
                request.getRemarks() != null ? request.getRemarks() : "Status updated to " + request.getStatus()
        );
        historyRepository.save(history);

        return getComplaintById(saved.getId(), authorityUser);
    }

    @Transactional
    public ComplaintResponse updatePriority(Long id, PriorityUpdateRequest request, User authorityUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + id));

        complaint.setPriority(request.getPriority());
        Complaint saved = complaintRepository.save(complaint);

        return getComplaintById(saved.getId(), authorityUser);
    }

    @Transactional
    public ComplaintResponse assignComplaint(Long id, AssignmentRequest request, User authorityUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setAssignedDepartment(department);
        complaint.setAssignedOfficer(request.getAssignedOfficer());

        if (complaint.getStatus() == ComplaintStatus.SUBMITTED || complaint.getStatus() == ComplaintStatus.UNDER_REVIEW) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        Complaint saved = complaintRepository.save(complaint);

        String remark = "Assigned to " + department.getName() +
                (request.getAssignedOfficer() != null && !request.getAssignedOfficer().isBlank()
                        ? " (Officer: " + request.getAssignedOfficer() + ")" : "") +
                (request.getRemarks() != null && !request.getRemarks().isBlank() ? ". Note: " + request.getRemarks() : "");

        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                oldStatus,
                complaint.getStatus(),
                authorityUser,
                remark
        );
        historyRepository.save(history);

        return getComplaintById(saved.getId(), authorityUser);
    }

    @Transactional
    public void deleteComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + id));

        historyRepository.deleteByComplaintId(complaint.getId());
        complaintRepository.delete(complaint);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long total = complaintRepository.count();
        long submitted = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long underReview = complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW);
        long assigned = complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long closed = complaintRepository.countByStatus(ComplaintStatus.CLOSED);

        return new DashboardStatsResponse(total, submitted, underReview, assigned, inProgress, resolved, closed);
    }
}

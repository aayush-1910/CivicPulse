package com.example.civic.repository;

import com.example.civic.entity.Complaint;
import com.example.civic.entity.ComplaintStatus;
import com.example.civic.entity.Priority;
import com.example.civic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUserOrderByCreatedAtDesc(User user);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    long countByStatus(ComplaintStatus status);

    long countByStatusIn(List<ComplaintStatus> statuses);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.address) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> findWithFilters(
            @Param("status") ComplaintStatus status,
            @Param("categoryId") Long categoryId,
            @Param("priority") Priority priority,
            @Param("search") String search);
}

package com.example.civic.repository;

import com.example.civic.entity.Complaint;
import com.example.civic.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Long> {
    List<ComplaintStatusHistory> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
    List<ComplaintStatusHistory> findByComplaintInOrderByCreatedAtAsc(List<Complaint> complaints);

    @Modifying
    @Query("DELETE FROM ComplaintStatusHistory history WHERE history.complaint.id = :complaintId")
    void deleteByComplaintId(Long complaintId);
}

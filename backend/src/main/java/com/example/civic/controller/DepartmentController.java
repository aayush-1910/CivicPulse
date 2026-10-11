package com.example.civic.controller;

import com.example.civic.entity.Department;
import com.example.civic.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }
}

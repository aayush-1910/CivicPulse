package com.example.civic.controller;

import com.example.civic.entity.Category;
import com.example.civic.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_AUTHORITY')")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}

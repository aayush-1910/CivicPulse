package com.example.civic.config;

import com.example.civic.entity.Category;
import com.example.civic.entity.Department;
import com.example.civic.repository.CategoryRepository;
import com.example.civic.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           DepartmentRepository departmentRepository) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Initialize Standard Municipal Problem Categories
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                    new Category("Pothole", "Potholes, road depressions, broken pavement, and craters"),
                    new Category("Garbage", "Uncollected garbage, overflowing public dumpsters, and illegal dumping"),
                    new Category("Broken Streetlight", "Flickering, damaged, or non-functional street lamps"),
                    new Category("Water Leakage", "Burst water pipes, road flooding, and low pressure leakages"),
                    new Category("Other", "General local municipal issues not covered by other categories")
            ));
        }

        // 2. Initialize Operational Municipal Departments
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(List.of(
                    new Department("Roads & Highway Maintenance", "Responsible for road repairs, potholes, and sidewalks"),
                    new Department("Sanitation & Solid Waste", "Handles municipal waste collection, cleaning, and dumpsters"),
                    new Department("Electrical & Street Lighting", "Maintains public streetlights, poles, and electrical lines"),
                    new Department("Water Supply & Sewerage", "Responsible for drinking water lines, drainage, and leakages"),
                    new Department("General Municipal Services", "Coordinates general civic inquiries and other maintenance")
            ));
        }
    }
}

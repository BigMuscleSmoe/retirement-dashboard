package com.stevenzhang.retirement.controller;

import com.stevenzhang.retirement.dto.ProjectionRequest;
import com.stevenzhang.retirement.dto.ProjectionResponse;
import com.stevenzhang.retirement.service.ProjectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projections")
public class ProjectionController {

    private final ProjectionService projectionService;

    public ProjectionController(ProjectionService projectionService) {
        this.projectionService = projectionService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<ProjectionResponse> calculate(@Valid @RequestBody ProjectionRequest request) {
        return ResponseEntity.ok(projectionService.calculate(request));
    }
}

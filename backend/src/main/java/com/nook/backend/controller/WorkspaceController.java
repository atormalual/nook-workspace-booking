package com.nook.backend.controller;

import com.nook.backend.entity.Workspace;
import com.nook.backend.service.WorkspaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public List<Workspace> getAllWorkspaces(
            @RequestParam(name = "minCapacity", required = false)
            Integer minCapacity) {

        if (minCapacity != null) {
            return workspaceService.filterByCapacity(minCapacity);
        }

        return workspaceService.getAllWorkspaces();
    }
}
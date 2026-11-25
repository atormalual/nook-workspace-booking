package com.nook.backend.service;

import com.nook.backend.entity.Workspace;
import com.nook.backend.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public List<Workspace> filterByCapacity(int minCapacity) {

        if (minCapacity < 1) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Minimum capacity must be at least 1"
            );
        }

        return workspaceRepository
                .findByCapacityGreaterThanEqual(minCapacity);
    }
}
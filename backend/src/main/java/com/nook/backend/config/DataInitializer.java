package com.nook.backend.config;

import com.nook.backend.entity.Workspace;
import com.nook.backend.repository.WorkspaceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final WorkspaceRepository workspaceRepository;

    public DataInitializer(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public void run(String... args) {

        if (workspaceRepository.count() == 0) {

            workspaceRepository.save(
                new Workspace("Executive Meeting Room", 8));

            workspaceRepository.save(
                new Workspace("Private Office", 2));

            workspaceRepository.save(
                new Workspace("Conference Room", 12));

            workspaceRepository.save(
                new Workspace("Individual Desk", 1));

            System.out.println("Nook workspaces initialized successfully.");
        }
    }
}
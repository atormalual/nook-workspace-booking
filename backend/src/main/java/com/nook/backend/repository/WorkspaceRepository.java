package com.nook.backend.repository;

import com.nook.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository
        extends JpaRepository<Workspace, Long> {

    List<Workspace> findByCapacityGreaterThanEqual(int capacity);
}
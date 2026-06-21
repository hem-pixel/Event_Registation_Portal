package com.eventportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalEvents;
    private long totalRegistrations;
    private long totalUsers;
    private long presentCount;
    private long absentCount;
}

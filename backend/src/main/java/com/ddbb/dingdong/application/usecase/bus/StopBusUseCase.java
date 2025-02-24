package com.ddbb.dingdong.application.usecase.bus;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.transportation.entity.vo.OperationStatus;
import com.ddbb.dingdong.domain.transportation.service.BusScheduleManagement;
import com.ddbb.dingdong.infrastructure.bus.subscription.BusSubscriptionManager;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StopBusUseCase implements UseCase<StopBusUseCase.Param, Void> {
    private final BusSubscriptionManager subscriptionManager;
    private final BusScheduleManagement busScheduleManagement;
    @Override
    @Transactional
    public Void execute(Param param) {
        busScheduleManagement.updateBusSchedule(param.busScheduleId, OperationStatus.ENDED);
        subscriptionManager.cleanPublisher(param.busScheduleId);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long busScheduleId;
    }
}

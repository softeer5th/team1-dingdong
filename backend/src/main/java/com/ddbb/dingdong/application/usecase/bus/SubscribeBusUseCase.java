package com.ddbb.dingdong.application.usecase.bus;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.transportation.service.BusSubscribeService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscribeBusUseCase implements UseCase<SubscribeBusUseCase.Param, Void> {
    private final BusSubscribeService busSubscribeService;

    @Override
    public Void execute(Param param) {
        busSubscribeService.subscribe(param.userId, param.busId);
        return null;
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        private Long busId;
        private Long userId;
    }
}

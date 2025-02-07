package com.ddbb.dingdong.presentation.endpoint.bus;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.bus.SubscribeBusUseCase;
import com.ddbb.dingdong.application.usecase.bus.UnsubscribeBusUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.Flow;

@RequestMapping("/api/bus/subscription")
@RestController
@RequiredArgsConstructor
public class SubscriptionEndPoint {
    private final SubscribeBusUseCase subscribeBusUseCase;
    private final UnsubscribeBusUseCase unsubscribeBusUseCase;

    @PostMapping("/{busId}")
    public ResponseEntity<Void> subscribe(@PathVariable Long busId, @LoginUser AuthUser authUser) {
        try {
            SubscribeBusUseCase.Param param = new SubscribeBusUseCase.Param(busId, authUser.id());
            subscribeBusUseCase.execute(param);
            return ResponseEntity.ok().build();
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{busId}")
    public ResponseEntity<Void> unsubscribe(@PathVariable Long busId, @LoginUser AuthUser authUser) {
        try {
            UnsubscribeBusUseCase.Param param = new UnsubscribeBusUseCase.Param(busId, authUser.id());
            unsubscribeBusUseCase.execute(param);
            return ResponseEntity.ok().build();
        } catch (DomainException e) {
            throw new APIException(e, HttpStatus.NOT_FOUND);
        }
    }
}

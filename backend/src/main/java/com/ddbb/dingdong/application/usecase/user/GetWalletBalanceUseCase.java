package com.ddbb.dingdong.application.usecase.user;

import com.ddbb.dingdong.application.common.Params;
import com.ddbb.dingdong.application.common.UseCase;
import com.ddbb.dingdong.domain.payment.repository.WalletQueryRepository;
import com.ddbb.dingdong.domain.payment.repository.projection.BalanceProjection;
import com.ddbb.dingdong.domain.user.service.error.UserErrors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetWalletBalanceUseCase implements UseCase<GetWalletBalanceUseCase.Param, GetWalletBalanceUseCase.Response> {
    private final WalletQueryRepository walletQueryRepository;

    @Override
    @Transactional
    public Response execute(Param param) {
        BalanceProjection projection =  walletQueryRepository.getBalance(param.userId)
                .orElseThrow(UserErrors.NOT_FOUND::toException);
        return new Response(projection.getBalance());
    }

    @Getter
    @AllArgsConstructor
    public static class Param implements Params {
        Long userId;
    }

    @Getter
    @AllArgsConstructor
    public static class Response {
        private long balance;
    }
}

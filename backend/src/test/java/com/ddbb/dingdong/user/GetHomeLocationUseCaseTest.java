package com.ddbb.dingdong.user;

import com.ddbb.dingdong.application.usecase.user.GetHomeLocationUseCase;
import com.ddbb.dingdong.application.usecase.user.GetHomeLocationUseCase.Param;
import com.ddbb.dingdong.application.usecase.user.GetHomeLocationUseCase.Result;
import com.ddbb.dingdong.domain.user.repository.UserQueryRepository;
import com.ddbb.dingdong.domain.user.repository.projection.HomeLocationProjection;
import com.ddbb.dingdong.domain.user.service.UserErrors;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetHomeLocationUseCaseTest {

    @Mock
    private UserQueryRepository userRepository;

    @InjectMocks
    private GetHomeLocationUseCase getHomeLocationUseCase;

    @Test
    @DisplayName("사용자 ID로 HomeLocationProjection 조회 테스트")
    void shouldReturnHomeLocation_whenUserExists() {
        // given
        Long userId = 1L;
        HomeLocationProjection mockProjection = mock(HomeLocationProjection.class);

        when(mockProjection.getHouseLatitude()).thenReturn(37.388558);
        when(mockProjection.getHouseLongitude()).thenReturn(126.953674);
        when(mockProjection.getStationName()).thenReturn("범계역");
        when(mockProjection.getStationLatitude()).thenReturn(37.388290);
        when(mockProjection.getStationLongitude()).thenReturn(126.952534);

        when(userRepository.queryHomeLocationByUserId(userId)).thenReturn(Optional.of(mockProjection));

        // when
        Result result = getHomeLocationUseCase.execute(new Param(userId));

        // then
        assertThat(result).isNotNull();
        assertThat(result.getHouseInfo()).isNotNull();
        assertThat(result.getHouseInfo().getLatitude()).isEqualTo(37.388558);
        assertThat(result.getHouseInfo().getLongitude()).isEqualTo(126.953674);
        assertThat(result.getStationInfo().getName()).isEqualTo("범계역");
        assertThat(result.getStationInfo().getLatitude()).isEqualTo(37.388290);
        assertThat(result.getStationInfo().getLongitude()).isEqualTo(126.952534);
    }

    @Test
    @DisplayName("사용자 ID로 조회된 Home 정보가 없으면 예외를 던진다")
    void shouldThrowException_whenUserNotFound() {
        // given
        Long userId = -1L;
        when(userRepository.queryHomeLocationByUserId(userId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> getHomeLocationUseCase.execute(new Param(userId)))
                .isInstanceOf(RuntimeException.class)
                .hasMessage(UserErrors.NOT_FOUND.getMessage());
    }
}
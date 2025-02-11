package com.ddbb.dingdong.presentation.endpoint.admin;

import com.ddbb.dingdong.application.exception.APIException;
import com.ddbb.dingdong.application.usecase.clustering.CreateClusterUseCase;
import com.ddbb.dingdong.application.usecase.clustering.GetLocationUseCase;
import com.ddbb.dingdong.application.usecase.routing.CreateRouteUseCase;
import com.ddbb.dingdong.domain.common.exception.DomainException;
import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.infrastructure.auth.AuthUser;
import com.ddbb.dingdong.infrastructure.auth.annotation.LoginUser;
import com.ddbb.dingdong.presentation.endpoint.admin.exchanges.CreateClusterRequestDTO;
import com.ddbb.dingdong.presentation.endpoint.admin.exchanges.CreateRouteRequestDTO;
import com.ddbb.dingdong.presentation.endpoint.admin.exchanges.CreateRouteResponseDTO;
import com.ddbb.dingdong.presentation.endpoint.admin.exchanges.GetLocationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class BusController {
    private final CreateClusterUseCase createClusterUseCase;
    private final CreateRouteUseCase createRouteUseCase;
    private final GetLocationUseCase getLocationUsecase;

    @PostMapping("/clusters")
    public ResponseEntity<Void> clusterUserLocations(
            @LoginUser AuthUser admin,
            @RequestBody CreateClusterRequestDTO createClusterRequestDTO
    ){
        Direction direction = createClusterRequestDTO.getDirection();
        LocalDateTime dingdongTime = createClusterRequestDTO.getDingdongTime();

        CreateClusterUseCase.Param param = new CreateClusterUseCase.Param(
               direction,
               dingdongTime
        );
        try {
            createClusterUseCase.execute(param);
        } catch (DomainException ex) {
            throw new APIException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/clusters/routes")
    public ResponseEntity<CreateRouteResponseDTO> createRoutesClusters(
            @LoginUser AuthUser admin,
            @RequestBody CreateRouteRequestDTO routeRequestDTO
    ) {
        int failCount = 0;
        Set<String> clusterLabels = routeRequestDTO.getClusters().stream()
                .map(CreateRouteRequestDTO.ClusterInfo::getClusterLabel)
                .collect(Collectors.toSet());
        for (String clusterLabel: clusterLabels) {
            CreateRouteUseCase.Param param = new CreateRouteUseCase.Param(
                    clusterLabel
            );
            try {
                createRouteUseCase.execute(param);
            } catch (Exception ex) {
                failCount++;
            }
        }
        int successCount = routeRequestDTO.getClusters().size() - failCount;
        CreateRouteResponseDTO response = new CreateRouteResponseDTO(successCount, failCount);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/reservations/pending/locations")
    public ResponseEntity<GetLocationUseCase.Result> getClusterLocations(
            @LoginUser AuthUser admin,
            @RequestBody GetLocationRequestDTO locationRequestDTO
    ) {
        GetLocationUseCase.Param param = new GetLocationUseCase.Param(
                locationRequestDTO.getDirection(),
                locationRequestDTO.getDingdongTime()
        );
        GetLocationUseCase.Result result = getLocationUsecase.execute(param);

        return ResponseEntity.ok().body(result);
    }
}
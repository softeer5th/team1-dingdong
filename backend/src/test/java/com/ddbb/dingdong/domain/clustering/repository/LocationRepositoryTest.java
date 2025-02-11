package com.ddbb.dingdong.domain.clustering.repository;

import com.ddbb.dingdong.domain.clustering.entity.Location;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@SpringBootTest
@Transactional
class LocationRepositoryTest {

    private static final Logger log = LoggerFactory.getLogger(LocationRepositoryTest.class);
    @Autowired
    private LocationRepository locationRepository;

    @Test
    @DisplayName("Location DB 가져오기 테스트")
    void findAll() {
        List<Location> locations = locationRepository.findAll();
        locations.sort(Comparator.comparing(Location::getClusterLabel));

        locations.forEach(location -> System.out.println(location.getClusterLabel()));
    }
}
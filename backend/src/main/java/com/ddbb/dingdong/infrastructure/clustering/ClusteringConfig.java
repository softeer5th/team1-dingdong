package com.ddbb.dingdong.infrastructure.clustering;

import de.lmu.ifi.dbs.elki.algorithm.clustering.kmeans.initialization.RandomUniformGeneratedInitialMeans;
import de.lmu.ifi.dbs.elki.utilities.random.RandomFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 클러스터링 관련 Bean 설정
 */
@Configuration
public class ClusteringConfig {

    @Bean
    public RandomUniformGeneratedInitialMeans randomUniformGeneratedInitialMeans() {
        return new RandomUniformGeneratedInitialMeans(RandomFactory.DEFAULT);
    }
}
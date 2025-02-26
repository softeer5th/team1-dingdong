CREATE DATABASE IF NOT EXISTS dingdong;
USE dingdong;

CREATE TABLE IF NOT EXISTS bus (
                                   id BIGINT NOT NULL AUTO_INCREMENT,
                                   name VARCHAR(255) NOT NULL,
                                   PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bus_schedule (
                                            id BIGINT NOT NULL AUTO_INCREMENT,
                                            remaining_seats INT NOT NULL,
                                            start_date DATE NOT NULL,
                                            arrival_time DATETIME(6),
                                            departure_time DATETIME(6),
                                            bus_id BIGINT,
                                            school_id BIGINT NOT NULL,
                                            created_at DATETIME(6) NOT NULL,
                                            direction ENUM('TO_HOME','TO_SCHOOL') NOT NULL,
                                            status ENUM('ENDED','READY','RUNNING') NOT NULL,
                                            PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE bus_schedule ADD CONSTRAINT FK_bus_schedule_bus FOREIGN KEY (bus_id) REFERENCES bus(id);

CREATE TABLE IF NOT EXISTS path (
                                    id BIGINT NOT NULL AUTO_INCREMENT,
                                    total_meter FLOAT(53) NOT NULL,
                                    total_seconds INT NOT NULL,
                                    bus_schedule_id BIGINT,
                                    PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE path ADD CONSTRAINT UK_path_bus_schedule UNIQUE (bus_schedule_id);
ALTER TABLE path ADD CONSTRAINT FK_path_bus_schedule FOREIGN KEY (bus_schedule_id) REFERENCES bus_schedule(id);

CREATE TABLE IF NOT EXISTS bus_stop (
                                        id BIGINT NOT NULL AUTO_INCREMENT,
                                        latitude FLOAT(53) NOT NULL,
                                        longitude FLOAT(53) NOT NULL,
                                        sequence INT NOT NULL,
                                        expected_arrival_time DATETIME(6) NOT NULL,
                                        location_id BIGINT,
                                        path_id BIGINT,
                                        road_name_address VARCHAR(255),
                                        PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE bus_stop ADD CONSTRAINT FK_bus_stop_path FOREIGN KEY (path_id) REFERENCES path(id);

CREATE TABLE IF NOT EXISTS line (
                                    id BIGINT NOT NULL AUTO_INCREMENT,
                                    sequence INT NOT NULL,
                                    total_meters INT NOT NULL,
                                    total_seconds INT NOT NULL,
                                    path_id BIGINT,
                                    PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE line ADD CONSTRAINT FK_line_path FOREIGN KEY (path_id) REFERENCES path(id);

CREATE TABLE IF NOT EXISTS point (
                                     id BIGINT NOT NULL AUTO_INCREMENT,
                                     latitude FLOAT(53) NOT NULL,
                                     longitude FLOAT(53) NOT NULL,
                                     sequence INT NOT NULL,
                                     line_id BIGINT,
                                     PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE point ADD CONSTRAINT FK_point_line FOREIGN KEY (line_id) REFERENCES line(id);

CREATE TABLE IF NOT EXISTS location (
                                        id BIGINT NOT NULL AUTO_INCREMENT,
                                        latitude FLOAT(53) NOT NULL,
                                        longitude FLOAT(53) NOT NULL,
                                        reservation_id BIGINT NOT NULL,
                                        cluster_label VARCHAR(255),
                                        station_name VARCHAR(255) NOT NULL,
                                        PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE location ADD CONSTRAINT UK_location_reservation UNIQUE (reservation_id);
ALTER TABLE location ADD COLUMN expected_arrival_time DATETIME(6);

CREATE TABLE IF NOT EXISTS reservation (
                                           id BIGINT NOT NULL AUTO_INCREMENT,
                                           start_date DATE NOT NULL,
                                           arrival_time DATETIME(6),
                                           departure_time DATETIME(6),
                                           user_id BIGINT NOT NULL,
                                           direction ENUM('TO_HOME','TO_SCHOOL') NOT NULL,
                                           status ENUM('ALLOCATED','CANCELED','FAIL_ALLOCATED','PENDING') NOT NULL,
                                           type ENUM('GENERAL','TOGETHER') NOT NULL,
                                           PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE reservation
    ADD COLUMN dingdong_time DATETIME AS (
        CASE
            WHEN status = 'CANCELED' THEN NULL
            WHEN direction = 'TO_SCHOOL' THEN arrival_time
            WHEN direction = 'TO_HOME' THEN departure_time
            END
        ) STORED,
    ADD UNIQUE INDEX uq_reservation_user_direction_dingdong_time (user_id, direction, dingdong_time);
ALTER TABLE reservation ADD CONSTRAINT UK_reservation_unique UNIQUE (user_id, dingdong_time, direction);

CREATE TABLE IF NOT EXISTS notification (
                                            id BIGINT NOT NULL AUTO_INCREMENT,
                                            is_read BIT NOT NULL,
                                            money INT,
                                            created_at DATETIME(6) NOT NULL,
                                            reservation_id BIGINT,
                                            user_id BIGINT NOT NULL,
                                            type ENUM('ALLOCATION_FAILED','ALLOCATION_SUCCESS','BUS_START','WELCOME') NOT NULL,
                                            PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS school (
                                      id BIGINT NOT NULL AUTO_INCREMENT,
                                      latitude FLOAT(53) NOT NULL,
                                      longitude FLOAT(53) NOT NULL,
                                      name VARCHAR(255) NOT NULL,
                                      road_name_address VARCHAR(255) NOT NULL,
                                      PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE school ADD CONSTRAINT UK_school_name UNIQUE (name);

CREATE TABLE IF NOT EXISTS home (
                                    id BIGINT NOT NULL AUTO_INCREMENT,
                                    house_latitude FLOAT(53) NOT NULL,
                                    house_longitude FLOAT(53) NOT NULL,
                                    station_latitude FLOAT(53),
                                    station_longitude FLOAT(53),
                                    station_name VARCHAR(255),
                                    station_road_address_name VARCHAR(255),
                                    PRIMARY KEY (id)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS timetable (
                                         id bigint not null auto_increment,
                                         mon_start_time time,
                                         mon_end_time time,
                                         tue_start_time time,
                                         tue_end_time time,
                                         wed_start_time time,
                                         wed_end_time time,
                                         thu_start_time time,
                                         thu_end_time time,
                                         fri_start_time time,
                                         fri_end_time time,
                                         primary key (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS user (
                                    id BIGINT NOT NULL AUTO_INCREMENT,
                                    created_at DATETIME(6),
                                    home_id BIGINT,
                                    school_id BIGINT,
                                    timetable_id BIGINT,
                                    email VARCHAR(255) NOT NULL,
                                    name VARCHAR(255) NOT NULL,
                                    password VARCHAR(255) NOT NULL,
                                    role ENUM('ADMIN','USER') NOT NULL,
                                    PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE user ADD CONSTRAINT UK_user_home UNIQUE (home_id);
ALTER TABLE user ADD CONSTRAINT UK_user_email UNIQUE (email);
ALTER TABLE user ADD CONSTRAINT FK_user_home FOREIGN KEY (home_id) REFERENCES home(id);
ALTER TABLE user ADD CONSTRAINT FK_user_school FOREIGN KEY (school_id) REFERENCES school(id);
ALTER TABLE user ADD CONSTRAINT FK_user_timetable FOREIGN KEY (timetable_id) REFERENCES timetable(id);

CREATE TABLE IF NOT EXISTS wallet (
                                      id BIGINT NOT NULL AUTO_INCREMENT,
                                      balance INT NOT NULL,
                                      last_updated_at DATETIME(6) NOT NULL,
                                      user_id BIGINT NOT NULL,
                                      PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE wallet ADD CONSTRAINT UK_wallet UNIQUE (user_id);
ALTER TABLE wallet ADD CONSTRAINT FK_wallet_user FOREIGN KEY (user_id) REFERENCES user(id);

CREATE TABLE IF NOT EXISTS dingdong_money_usage_history (
                                                            id BIGINT NOT NULL AUTO_INCREMENT,
                                                            amount INT NOT NULL,
                                                            remain INT NOT NULL,
                                                            refunded_reservation_id BIGINT,
                                                            time_stamp DATETIME(6) NOT NULL,
                                                            wallet_id BIGINT,
                                                            type ENUM('WELCOME_MONEY_CHARGE','FREE_CHARGE','PAY','REFUND') NOT NULL,
                                                            PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE dingdong_money_usage_history ADD CONSTRAINT FK_money_usage_wallet FOREIGN KEY (wallet_id) REFERENCES wallet(id);

CREATE TABLE IF NOT EXISTS ticket (
                                      id BIGINT NOT NULL AUTO_INCREMENT,
                                      bus_schedule_id BIGINT NOT NULL,
                                      bus_stop_id BIGINT NOT NULL,
                                      reservation_id BIGINT,
                                      PRIMARY KEY (id)
) ENGINE=InnoDB;
ALTER TABLE ticket ADD CONSTRAINT UK_ticket_unique2 UNIQUE (reservation_id);
ALTER TABLE ticket ADD CONSTRAINT FK_ticket_reservation FOREIGN KEY (reservation_id) REFERENCES reservation(id);

CREATE TABLE IF NOT EXISTS fcmtoken (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           token VARCHAR(255) NOT NULL,
                           is_active BOOLEAN NOT NULL,
                           last_modified_at DATETIME,
                           user_id BIGINT NOT NULL
);

ALTER TABLE fcmtoken ADD CONSTRAINT uq_fcm_token UNIQUE (token, user_id);
ALTER TABLE fcmtoken ADD CONSTRAINT fk_fcm_token_user FOREIGN KEY (user_id) REFERENCES user(id);

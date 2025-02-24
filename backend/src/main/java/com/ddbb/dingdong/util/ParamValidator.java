package com.ddbb.dingdong.util;

import java.util.regex.Pattern;

public class ParamValidator {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()\\-_\\[\\]+=])(?=\\S+$).{8,20}$";
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    /**
     * 이메일이 올바른 형식인지 확인
     * @param email 검증할 이메일 문자열
     * @return true: 올바른 이메일, false: 올바르지 않은 이메일
     */
    public static boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * 비밀번호가 올바른 형식인지 확인
     * @param password 검증할 비밀번호 문자열
     * @return true: 올바른 비밀번호, false: 올바르지 않은 비밀번호
     */
    public static boolean isValidPassword(String password) {
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * 주소가 올바른 형식인지 확인
     * @param stationName 검증할 정류장 이름 문자열
     * @param stationLatitude 검증할 정류장 위도
     * @param stationLongitude 검증할 정류장 경도
     * @return true: 올바른 정보, false: 올바르지 않은 정보
     */
    public static boolean isStationInfoExists(String stationName, Double stationLatitude, Double stationLongitude) {
        return stationName != null || stationLatitude != null || stationLongitude != null;
//        return (stationName != null && stationLatitude != null && stationLongitude != null) ||
//                ((stationName == null || stationName.isBlank()
//                && (stationLatitude == null || stationLatitude.isNaN())
//                && (stationLongitude == null || stationLongitude.isNaN())));
    }

    /**
     * 위도가 올바른 형식인지 확인
     * @param latitude 검증할 위도
     * @return true: 올바른 위도, false: 올바르지 않은 위도
     */
    public static boolean isValidLatitude(Double latitude) {
        return latitude != null && (-90.0 <= latitude && latitude <= 90.0);
    }

    /**
     * 경도가 올바른 형식인지 확인
     * @param longitude 검증할 경도
     * @return true: 올바른 경도, false: 올바르지 않은 경도
     */
    public static boolean isValidLongitude(Double longitude) {
        return longitude != null && (-180.0 <= longitude && longitude <= 180.0);
    }

    /**
     * 이름이 올바른 형식인지 확인
     * @param name 검증할 위도
     * @return true: 올바른 이름, false: 올바르지 않은 이름
     */
    public static boolean isValidName(String name) {
        return name != null && !name.isBlank();
    }
}

package com.ddbb.dingdong.util;


import java.text.DecimalFormat;

public class FormatUtil {
    private static final DecimalFormat df = new DecimalFormat("##0.###############");

    public static String format(Long busId, double lat, double lng) {
        return new StringBuilder()
                .append("{")
                .append("\"id\":").append(busId)
                .append(",\"latitude\":").append(df.format(lat))
                .append(",\"longitude\":").append(df.format(lng))
                .append("}")
                .toString();
    }
}

package com.phil.movieland.utils;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;

public class Utils {

    public static String printMap(Map mp) {
        StringBuilder stringBuilder = new StringBuilder();
        Iterator it = mp.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            stringBuilder.append(pair.getKey() + " = " + pair.getValue());
            stringBuilder.append("\n");
        }
        return stringBuilder.toString();
    }

    public static <T> String joinToStringList(T... values) {
        return Arrays.stream(values).map(String::valueOf).collect(Collectors.joining(","));
    }
}

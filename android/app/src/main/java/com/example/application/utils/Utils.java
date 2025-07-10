package com.example.application.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    public static List<String> extractUrls(String text) {
        List<String> urls = new ArrayList<>();
        Pattern urlPattern = Pattern.compile("(https?://[^\\s]+|www\\.[^\\s]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = urlPattern.matcher(text);

        while (matcher.find()) {
            urls.add(matcher.group());
        }
        return urls;
    }
}
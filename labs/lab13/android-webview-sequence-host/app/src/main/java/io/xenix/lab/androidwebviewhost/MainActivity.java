package io.xenix.lab.androidwebviewhost;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private String probeMode;
    private final java.util.List<String> events = new java.util.ArrayList<>();
    private boolean reported = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        probeMode = getIntent() != null ? getIntent().getStringExtra("probe_mode") : null;
        if (probeMode == null || probeMode.isEmpty()) {
            probeMode = "normal";
        }

        webView = new WebView(this);
        setContentView(webView);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new ProbeBridge(), "AndroidProbe");
        String asset = "fault".equals(probeMode) ? "probe-fault.html" : "probe.html";
        webView.loadUrl("file:///android_asset/" + asset);
    }

    private final class ProbeBridge {
        @JavascriptInterface
        public void onResult(String detail) {
            events.add(detail);
            if ("closed".equals(detail) && !reported) {
                webView.postDelayed(() -> {
                    if (reported) {
                        return;
                    }
                    String[] expected = new String[] {"boot", "open", "data:1", "data:2", "data:3", "closed"};
                    java.util.List<String> expectedList = java.util.Arrays.asList(expected);
                    if (events.equals(expectedList)) {
                        writeProbeResult("webview-stream-probe.json", "{\"status\":\"ok\",\"detail\":\"" + escapeJson(String.join(" -> ", events)) + "\"}");
                    } else {
                        writeProbeResult("webview-stream-probe.json", "{\"status\":\"fail\",\"detail\":\"" + escapeJson("expected " + String.join(" -> ", expectedList) + " got " + String.join(" -> ", events)) + "\"}");
                    }
                    reported = true;
                }, 150);
            }
        }
    }

    private void writeProbeResult(String fileName, String json) {
        try {
            File file = new File(getFilesDir(), fileName);
            try (FileOutputStream outputStream = new FileOutputStream(file, false)) {
                outputStream.write(json.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            }
            System.out.println("ANDROID_WEBVIEW_MESSAGE_PROBE_RESULT=" + json);
        } catch (Exception e) {
            String fallback = "{\"status\":\"error\",\"detail\":\"" + escapeJson(e.toString()) + "\"}";
            System.out.println("ANDROID_WEBVIEW_MESSAGE_PROBE_RESULT=" + fallback);
        }
    }

    private String escapeJson(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"");
    }
}

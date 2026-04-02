package io.xenix.lab.androidwebviewhost;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private String probeMode;

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
        webView.addJavascriptInterface(new ProbeBridge(), "AndroidProbe");
        webView.loadDataWithBaseURL(
            "https://lab.local/",
            buildTestHtml(probeMode),
            "text/html",
            "utf-8",
            null
        );
    }

    private String buildTestHtml(String probeMode) {
        String addBody = "fault".equals(probeMode) ? "return a-b;" : "return a+b;";
        return "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><script>" +
            "window.__test__={add:function(a,b){" + addBody + "}};" +
            "window.addEventListener('load', function(){ window.AndroidProbe.onResult(String(window.__test__.add(1,2))); });" +
            "</script></body></html>";
    }

    private final class ProbeBridge {
        @JavascriptInterface
        public void onResult(String detail) {
            if ("3".equals(detail)) {
                writeProbeResult("webview-message-probe.json", "{\"status\":\"ok\",\"detail\":\"" + escapeJson(detail) + "\"}");
            } else {
                writeProbeResult("webview-message-probe.json", "{\"status\":\"fail\",\"detail\":\"" + escapeJson("expected 3 got " + detail) + "\"}");
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

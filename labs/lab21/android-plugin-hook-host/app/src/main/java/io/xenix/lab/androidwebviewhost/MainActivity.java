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
            if ("pass".equals(detail)) {
                writeProbeResult("webview-plugin-permission-request-probe.json", "{\"status\":\"ok\",\"detail\":\"" + escapeJson(detail) + "\"}");
            } else {
                writeProbeResult("webview-plugin-permission-request-probe.json", "{\"status\":\"fail\",\"detail\":\"" + escapeJson(detail) + "\"}");
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

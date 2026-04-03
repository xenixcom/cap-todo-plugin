package io.xenix.lab.androidwebviewhost;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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
    private final Handler handler = new Handler(Looper.getMainLooper());

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
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript("""
                    window.__nativeFixture__ = {
                      permission: { microphone: 'denied' },
                      availability: { enabled: false },
                      session: { token: null }
                    };
                    window.__nativeEventLog__ = [];
                    window.__nativeDone__ = false;
                    """, null);
                scheduleNativeProgression();
            }
        });
        webView.addJavascriptInterface(new ProbeBridge(), "AndroidProbe");
        String asset = "fault".equals(probeMode) ? "probe-fault.html" : "probe.html";
        webView.loadUrl("file:///android_asset/" + asset);
    }

    private void scheduleNativeProgression() {
        handler.postDelayed(() -> webView.evaluateJavascript(
            "window.__nativeFixture__.permission.microphone = 'granted'; window.__nativeEventLog__.push('permission:granted');",
            null
        ), 120);
        handler.postDelayed(() -> webView.evaluateJavascript(
            "window.__nativeFixture__.availability.enabled = true; window.__nativeEventLog__.push('availability:enabled');",
            null
        ), 240);
        if ("fault".equals(probeMode)) {
            handler.postDelayed(() -> webView.evaluateJavascript(
                "window.__nativeFixture__.session.token = 'session-bad'; window.__nativeEventLog__.push('session:stale'); window.__nativeDone__ = true;",
                null
            ), 360);
            return;
        }

        handler.postDelayed(() -> webView.evaluateJavascript(
            "window.__nativeFixture__.session.token = 'session-1'; window.__nativeEventLog__.push('session:opened'); window.__nativeDone__ = true;",
            null
        ), 360);
    }

    private final class ProbeBridge {
        @JavascriptInterface
        public void onResult(String detail) {
            if ("pass".equals(detail)) {
                writeProbeResult("webview-native-fixture-probe.json", "{\"status\":\"ok\",\"detail\":\"" + escapeJson(detail) + "\"}");
            } else {
                writeProbeResult("webview-native-fixture-probe.json", "{\"status\":\"fail\",\"detail\":\"" + escapeJson(detail) + "\"}");
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

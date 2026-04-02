package io.xenix.lab.androidwebviewhost;

import android.os.Bundle;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new ProbeClient());
        webView.loadDataWithBaseURL(
            "https://lab.local/",
            "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><script>" +
                "window.__test__={add:function(a,b){return a+b;}};" +
            "</script></body></html>",
            "text/html",
            "utf-8",
            null
        );
    }

    private final class ProbeClient extends WebViewClient {
        @Override
        public void onPageFinished(WebView view, String url) {
            view.evaluateJavascript(
                "window.__test__.add(1,2)",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        String detail = value == null ? "null" : value.replaceAll("^\"|\"$", "");
                        writeProbeResult("{\"status\":\"ok\",\"detail\":\"" + escapeJson(detail) + "\"}");
                    }
                }
            );
        }
    }

    private void writeProbeResult(String json) {
        try {
            File file = new File(getFilesDir(), "webview-host-probe.json");
            try (FileOutputStream outputStream = new FileOutputStream(file, false)) {
                outputStream.write(json.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            }
            System.out.println("ANDROID_WEBVIEW_HOST_PROBE_RESULT=" + json);
        } catch (Exception e) {
            String fallback = "{\"status\":\"error\",\"detail\":\"" + escapeJson(e.toString()) + "\"}";
            System.out.println("ANDROID_WEBVIEW_HOST_PROBE_RESULT=" + fallback);
        }
    }

    private String escapeJson(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"");
    }
}

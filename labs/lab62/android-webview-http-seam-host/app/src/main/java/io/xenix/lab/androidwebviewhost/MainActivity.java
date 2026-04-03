package io.xenix.lab.androidwebviewhost;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewClientCompat;
import androidx.webkit.WebViewFeature;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

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

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, android.webkit.WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return assetLoader.shouldInterceptRequest(android.net.Uri.parse(url));
            }
        });

        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            writeProbeResult(
                "webview-http-seam-probe.json",
                "{\"status\":\"error\",\"detail\":\"WEB_MESSAGE_LISTENER unsupported\"}"
            );
            return;
        }

        WebViewCompat.addWebMessageListener(
            webView,
            "AndroidProbe",
            Collections.singleton("https://appassets.androidplatform.net"),
            (view, message, sourceOrigin, isMainFrame, replyProxy) -> handleProbeDetail(message.getData())
        );

        String asset = "fault".equals(probeMode) ? "probe-fault.html" : "probe.html";
        webView.loadUrl("https://appassets.androidplatform.net/assets/" + asset);
    }

    private void handleProbeDetail(String detail) {
        if ("pass".equals(detail)) {
            writeProbeResult("webview-http-seam-probe.json", "{\"status\":\"ok\",\"detail\":\"" + escapeJson(detail) + "\"}");
        } else {
            writeProbeResult("webview-http-seam-probe.json", "{\"status\":\"fail\",\"detail\":\"" + escapeJson(detail) + "\"}");
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

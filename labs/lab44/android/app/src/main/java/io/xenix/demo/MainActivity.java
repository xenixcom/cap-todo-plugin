package io.xenix.demo;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.BridgeActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean reported;
    private int attempts;
    private String probeMode;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        probeMode = getIntent() != null ? getIntent().getStringExtra("probe_mode") : null;
        if (probeMode == null || probeMode.isEmpty()) {
            probeMode = "normal";
        }
        startPolling();
    }

    private void startPolling() {
        attempts = 0;
        reported = false;
        handler.postDelayed(this::pollResult, 500);
    }

    private void pollResult() {
        if (reported || getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        getBridge().getWebView().evaluateJavascript("window.__probeResult ?? null", value -> {
            if (reported) {
                return;
            }

            if (value != null && !"null".equals(value)) {
                reported = true;
                writeProbeResult(unquote(value));
                return;
            }

            attempts += 1;
            if (attempts >= 20) {
                reported = true;
                writeProbeResult("{\"status\":\"error\",\"detail\":\"no probe result\"}");
                return;
            }

            handler.postDelayed(this::pollResult, 500);
        });
    }

    private void writeProbeResult(String json) {
        try {
            File file = new File(getFilesDir(), "webview-native-bridge-probe.json");
            try (FileOutputStream outputStream = new FileOutputStream(file, false)) {
                outputStream.write(json.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            }
        } catch (Exception ignored) {
        }
    }

    private String unquote(String value) {
        String result = value;
        if (result.startsWith("\"") && result.endsWith("\"") && result.length() >= 2) {
            result = result.substring(1, result.length() - 1);
        }
        return result
            .replace("\\\\", "\\")
            .replace("\\\"", "\"")
            .replace("\\n", "\n");
    }

    @Override
    public void onResume() {
        super.onResume();
        if ("granted".equals(probeMode)) {
            requestPermissions(new String[] { android.Manifest.permission.RECORD_AUDIO }, 4401);
        }
    }
}

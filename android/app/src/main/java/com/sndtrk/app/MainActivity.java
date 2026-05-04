package com.sndtrk.app; // Pastikan ini sama dengan folder kamu

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Baris ini opsional, biasanya sync sudah otomatis mendaftarkan plugin
}

    @Override
    public void onResume() {
        super.onResume();
        // Memaksa WebView agar tidak mati saat aplikasi di latar belakang
        WebView webView = this.bridge.getWebView();
        if (webView != null) {
            webView.setKeepScreenOn(true);
        }
    }
}
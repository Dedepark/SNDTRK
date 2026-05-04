package com.sndtrk.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Kunci WebView agar tetap bisa muter audio meski di background
        WebView webView = this.bridge.getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            // Izinkan media muter tanpa interaksi user setelah balik dari background
            settings.setMediaPlaybackRequiresUserGesture(false);
            // Kunci layar tetap ON lewat level sistem WebView
            webView.setKeepScreenOn(true);
        }
    }

    @Override
    protected void onPause() {
        // Jangan panggil super.onPause() untuk WebView agar musik nggak keputus
        // Tapi kita tetap panggil BridgeActivity-nya biar nggak crash
        super.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Paksa resume audio context kalau sempat tersendat
        WebView webView = this.bridge.getWebView();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
    }
}
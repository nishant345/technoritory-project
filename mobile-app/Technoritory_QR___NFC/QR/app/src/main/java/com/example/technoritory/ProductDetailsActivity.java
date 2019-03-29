package com.example.technoritory;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

public class ProductDetailsActivity extends AppCompatActivity {

    String data;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_productdetails);

        data = getIntent().getStringExtra("details");

        ShowDetails showDetails = new ShowDetails();

        WebView webView = findViewById(R.id.productDetailsView);
        webView.loadUrl("file:///android_asset/www/productDetails.html");
        webView.addJavascriptInterface(showDetails,"ob");
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());


    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == android.R.id.home){
            this.finish();;
        }

        return super.onOptionsItemSelected(item);
    }


    class ShowDetails{
        @android.webkit.JavascriptInterface
        public String returnData(){ return data; }
    }
}

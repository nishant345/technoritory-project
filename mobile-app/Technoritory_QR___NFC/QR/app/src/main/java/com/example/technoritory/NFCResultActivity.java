package com.example.technoritory;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NFCResultActivity extends AppCompatActivity {
    private TextView result;
    String s  = "";
    String data;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfcresult);

        //result = findViewById(R.id.nfcresult);

        data = getIntent().getStringExtra("code");

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        //result.setText(data);

        new NFCResultActivity.GetAllProductData().execute(new ApiConnector());

        ShowDetails showDetails = new ShowDetails();

        WebView webView =  findViewById(R.id.nfcdisplayView);
        webView.loadUrl("file:///android_asset/www/image.html");
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

    public void setTextToTextView(JSONArray jsonArray) {

        for(int i=0; i<jsonArray.length();i++){

            JSONObject json = null;
            try {
                json = jsonArray.getJSONObject(i);
                s = s +
                        "Product Image : "+json.getString("product_image")+";"+
                        "Transaction Hash : "+json.getString("transaction_hash")+";"+
                        "Product No : "+json.getInt("product_no")+";"+
                        "Product Name : "+json.getString("product_name")+";"+
                        "Product Batch : "+json.getString("product_batch")+";"+
                        "Product Type : "+json.getString("product_type")+";"+
                        "Product Link : "+json.getString("product_link")+";"+
                        "Product Description : "+json.getString("product_description")+";"+
                        "Manufacturer ID : "+json.getInt("manufacturer_id")+";"+
                        "Manufacturer Name : "+json.getString("manufacturer_name")+";"+
                        "Manufacturer Address : "+json.getString("manufacturer_address")+";"+
                        "Manufacturing Country : "+json.getString("manufacturing_country")+";"+
                        "Product Story1 : "+json.getString("story1")+";"+
                        "Product Story2 : "+json.getString("story2")+";"+
                        "Product Story3 : "+json.getString("story3")+";"+
                        "Image1 : "+json.getString("image1")+";"+
                        "Image2 : "+json.getString("image2")+";"+
                        "Image3 : "+json.getString("image3");

            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

        //this.result.setText(s);

    }


    private class GetAllProductData extends AsyncTask<ApiConnector,Long,JSONArray> {
        @Override
        protected JSONArray doInBackground(ApiConnector... params) {

            // it is executed on Background thread

            return params[0].getAllData(data);
        }

        @Override
        protected void onPostExecute(JSONArray jsonArray) {

            setTextToTextView(jsonArray);


        }
    }

    class ShowDetails{
        @android.webkit.JavascriptInterface
        public String returnData(){
            return s;
        }

        @android.webkit.JavascriptInterface
        public void details(String data){

            //  details activity
            Intent intent = new Intent(NFCResultActivity.this, ProductDetailsActivity.class);
            intent.putExtra("details", data);
            startActivity(intent);
        }

        @android.webkit.JavascriptInterface
        public void journey(String data){

            //  details activity
            Intent intent = new Intent(NFCResultActivity.this, ProductJourneyActivity.class);
            intent.putExtra("details", data);
            startActivity(intent);
        }

    }
}

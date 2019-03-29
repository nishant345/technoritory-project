package com.example.technoritory;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

public class NotAvilableActivity extends AppCompatActivity {

    private TextView result;
    String data;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notavilable);

        result = findViewById(R.id.notavilable);


        //result.setText(data);

    }

}

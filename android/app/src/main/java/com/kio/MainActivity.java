package com.kio;

import android.os.Bundle;
import androidx.annotation.Nullable;
import com.zoontek.rnbootsplash.RNBootSplash;

import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        RNBootSplash.init(this);
        super.onCreate(savedInstanceState);
    }

}

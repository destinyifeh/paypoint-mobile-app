# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


-keep public class com.horcrux.svg.** {*;}
-keep class io.invertase.firebase.** { *; }
-keep class com.finch_agent_mobile_app.BuildConfig { *; }
-keep class com.facebook.hermes.unicode.* { *; }

# WebPay stuff
-keep public class com.interswitchng.iswmobilesdk.IswMobileSdk {
  public protected *;
}

-keep public interface com.interswitchng.iswmobilesdk.IswMobileSdk$IswPaymentCallback {*;}

-keep public class com.interswitchng.iswmobilesdk.shared.models.core.** {
    public protected *;
    !transient <fields>;
}
-keep public class com.interswitchng.iswmobilesdk.shared.models.payment.** {
    public protected *;
    !transient <fields>;
}
# SC provider
-keep class org.spongycastle.**
-dontwarn org.spongycastle.jce.provider.X509LDAPCertStoreSpi
-dontwarn org.spongycastle.x509.util.LDAPStoreHelper


# -keep resources string/build_config_package
-dontwarn io.invertase.firebase.**

-keep class com.google.zxing.** { *; }
-dontwarn com.google.zxing.**

-keep class com.telpo.** { *; }
-dontwarn com.telpo.**

-keep class com.common.sdk.printer.** { *; }
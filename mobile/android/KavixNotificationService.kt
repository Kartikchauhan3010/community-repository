package com.kavix.app.services

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.content.Intent
import android.util.Log

class KavixNotificationService : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val packageName = sbn?.packageName ?: return
        val extras = sbn.notification?.extras ?: return
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""

        if (text.contains("UPI") || text.contains("PIN") || text.contains("refund") || text.contains("bill")) {
            Log.d("Kavix", "Intercepted threat payload from $packageName: $text")
            val intent = Intent("com.kavix.SCAM_DETECTED").apply {
                putExtra("title", title)
                putExtra("text", text)
                putExtra("package", packageName)
            }
            sendBroadcast(intent)
        }
    }
}

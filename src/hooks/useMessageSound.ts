"use client";

/**
 * صوت رسالة الشات — مختلف عن صوت النوتيفيكيشن (useNotifications.playNotificationBeep).
 *
 * النوتيفيكيشن: نغمتين صاعدتين (880Hz → 1100Hz) — إحساس "تنبيه".
 * الرسالة هنا: نغمة واحدة قصيرة هابطة (600Hz → 420Hz) — إحساس "تك" خفيف
 * عشان يكون مميز للسمع ومايتلخبطش مع النوتيفيكيشن، وبرضو مايضايقش لو
 * جت رسايل كتير ورا بعض في محادثة سريعة.
 */
export function playMessageBeep() {
    try {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const duration = 0.12;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(420, now + duration);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.22, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);

        setTimeout(() => ctx.close(), 400);
    } catch {
        // المتصفح ممكن يبلوك الصوت (autoplay policy) — مفيش error يطلع للمستخدم
    }
}

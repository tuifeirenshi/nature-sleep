package com.rainsleep.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;

import java.io.InputStream;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AudioPlaybackService extends Service {
    public static volatile boolean running = false, playing = false;
    public static volatile long deadline = 0;
    public static volatile int minutes = 0;
    public static volatile float volume = 1f;
    public static volatile String track = "rain-jungle";
    public static volatile boolean mixAudio = false;

    static final String[] IDS = {"rain-jungle", "waves", "stream", "forest-night", "campfire", "sleep-music", "binaural"};
    static final String[] NAMES = {"热带雨林", "海浪", "溪流", "夜间虫鸣", "篝火", "助眠音乐", "脑波助眠"};
    private static final String[] AUDIO_ASSETS = {
            "rainforest-audio.wav", "waves-audio.wav", "stream-audio.wav",
            "night-insects-audio.wav", "campfire-audio.wav", "sleep-music-audio.wav",
            "brainwave-sleep-audio.wav"
    };
    private static final String[] COVER_ASSETS = {
            "rainforest.jpg", "waves.jpg", "stream.jpg", "night-insects.jpg",
            "campfire.jpg", "sleep-music.jpg", "brainwave-sleep.jpg"
    };
    private static final int NOTIFICATION_ID = 1;
    private static final int[] TIMER_MODES = {15, 30, 60, 0};

    private AudioTrack player, retiring;
    private long fadeStarted = 0;
    private int generation = 0;
    private boolean destroyed = false;
    private boolean resumeAfterFocusLoss = false;
    private float duck = 1;
    private AudioManager manager;
    private AudioFocusRequest focus;
    private MediaSession session;
    private PowerManager.WakeLock wake;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final ExecutorService loader = Executors.newSingleThreadExecutor();

    public static boolean validTrack(String id) { return Arrays.asList(IDS).contains(id); }
    private int trackIndex() { int index = Arrays.asList(IDS).indexOf(track); return index < 0 ? 0 : index; }

    @Override public void onCreate() {
        super.onCreate();
        running = true;
        manager = (AudioManager) getSystemService(AUDIO_SERVICE);
        mixAudio = getSharedPreferences("playback", 0).getBoolean("mixAudio", false);
        getSystemService(NotificationManager.class).createNotificationChannel(
                new NotificationChannel("rain", "自然入眠播放", NotificationManager.IMPORTANCE_LOW));
        session = new MediaSession(this, "NatureSleep");
        session.setCallback(new MediaSession.Callback() {
            @Override public void onPlay() { play(); }
            @Override public void onPause() { pausePlayback(); }
            @Override public void onStop() { pausePlayback(); }
            @Override public void onSkipToNext() { changeTrack(1); }
            @Override public void onSkipToPrevious() { changeTrack(-1); }
            @Override public void onCustomAction(String action, Bundle extras) { if ("timer".equals(action)) cycleTimer(); }
        });
        session.setActive(true);
        wake = ((PowerManager) getSystemService(POWER_SERVICE)).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "NatureSleep:Audio");
        wake.setReferenceCounted(false);
        focus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
                .setOnAudioFocusChangeListener(change -> {
                    if (change == AudioManager.AUDIOFOCUS_LOSS) pausePlayback();
                    else if (change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) pauseForFocusLoss();
                    else if (change == AudioManager.AUDIOFOCUS_GAIN && resumeAfterFocusLoss) {
                        resumeAfterFocusLoss = false;
                        play();
                    }
                    else duck = change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK ? .2f : 1;
                }).build();
        refreshNotification();
    }

    private PendingIntent serviceAction(int request, String action) {
        return PendingIntent.getService(this, request, new Intent(this, AudioPlaybackService.class).setAction(action),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private Bitmap coverArt() {
        try (InputStream in = getAssets().open("media/covers/" + COVER_ASSETS[trackIndex()])) {
            return BitmapFactory.decodeStream(in);
        } catch (Exception error) {
            Log.w("NatureSleep", "Track cover unavailable for " + track, error);
            return null;
        }
    }

    private Notification notification() {
        int index = trackIndex();
        boolean active = playing;
        Bitmap art = coverArt();
        session.setPlaybackState(new PlaybackState.Builder()
                .setActions(PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE | PlaybackState.ACTION_PLAY_PAUSE
                        | PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS | PlaybackState.ACTION_STOP)
                .addCustomAction(new PlaybackState.CustomAction.Builder("timer", timerLabel(), android.R.drawable.ic_lock_idle_alarm).build())
                .setState(active ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED, 0, active ? 1 : 0).build());
        PendingIntent open = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Notification.Builder builder = new Notification.Builder(this, "rain")
                .setSmallIcon(R.drawable.ic_leaf)
                .setLargeIcon(art)
                .setContentTitle("自然入眠")
                .setContentText(NAMES[index] + (active ? " · 播放中" : " · 已暂停"))
                .setContentIntent(open)
                .setOngoing(active);
        builder.addAction(new Notification.Action.Builder(android.R.drawable.ic_media_previous, "上一首", serviceAction(2, "previous")).build());
        builder.addAction(new Notification.Action.Builder(active ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play,
                active ? "暂停" : "播放", serviceAction(3, active ? "pause" : "play")).build());
        builder.addAction(new Notification.Action.Builder(android.R.drawable.ic_media_next, "下一首", serviceAction(4, "next")).build());
        builder.addAction(new Notification.Action.Builder(android.R.drawable.ic_lock_idle_alarm, timerLabel(), serviceAction(5, "timerCycle")).build());
        return builder.setStyle(new Notification.MediaStyle().setMediaSession(session.getSessionToken())
                .setShowActionsInCompactView(0, 1, 3)).build();
    }

    private String timerLabel() { return minutes == 0 ? "定时" : "定时 " + minutes + " 分"; }

    private void load(String id) {
        final int token = ++generation;
        loader.submit(() -> {
            try {
                AudioTrack next = PcmLoop.load(getAssets(), "media/" + audioAsset(id));
                handler.post(() -> {
                    if (destroyed || !playing || token != generation) { next.release(); return; }
                    release(retiring);
                    retiring = player;
                    player = next;
                    fadeStarted = SystemClock.elapsedRealtime();
                    player.play();
                    refreshNotification();
                });
            } catch (Exception error) {
                Log.e("NatureSleep", "Audio loading failed", error);
                handler.post(() -> { if (token == generation) stop(); });
            }
        });
    }

    static String audioAsset(String id) {
        int index = Arrays.asList(IDS).indexOf(id);
        if (index < 0) throw new IllegalArgumentException("Unknown audio track: " + id);
        return AUDIO_ASSETS[index];
    }

    private final Runnable tick = new Runnable() {
        @Override public void run() {
            if (!playing && !resumeAfterFocusLoss) return;
            long left = deadline == 0 ? Long.MAX_VALUE : deadline - System.currentTimeMillis();
            if (left <= 0) { stop(); return; }
            if (!playing) { handler.postDelayed(this, Math.min(1000, left)); return; }
            float fade = Math.min(1, Math.max(0, (SystemClock.elapsedRealtime() - fadeStarted) / 2000f));
            float output = volume * duck * Math.min(1, left / 30000f);
            if (player != null) player.setVolume(output * fade);
            if (retiring != null) {
                retiring.setVolume(output * (1 - fade));
                if (fade >= 1) { release(retiring); retiring = null; }
            }
            handler.postDelayed(this, 50);
        }
    };

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;
        String action = intent.getAction();
        if ("play".equals(action)) play();
        else if ("track".equals(action)) {
            String next = intent.getStringExtra("track");
            if (validTrack(next) && !next.equals(track)) { track = next; refreshNotification(); if (playing) load(next); }
        } else if ("pause".equals(action)) pausePlayback();
        else if ("previous".equals(action)) changeTrack(-1);
        else if ("next".equals(action)) changeTrack(1);
        else if ("timerCycle".equals(action)) cycleTimer();
        else if ("timer".equals(action)) {
            minutes = intent.getIntExtra("value", 0);
            deadline = playing && minutes > 0 ? System.currentTimeMillis() + minutes * 60000L : 0;
            if (playing) { handler.removeCallbacks(tick); handler.post(tick); }
            refreshNotification();
        } else if ("mixAudio".equals(action)) {
            mixAudio = intent.getBooleanExtra("value", false);
            getSharedPreferences("playback", 0).edit().putBoolean("mixAudio", mixAudio).apply();
            if (playing && !requestFocus()) pausePlayback();
        } else if ("volume".equals(action)) volume = Math.max(0, Math.min(1, (float) intent.getDoubleExtra("value", 1)));
        return START_NOT_STICKY;
    }

    private void play() {
        if (playing) return;
        resumeAfterFocusLoss = false;
        startForeground(NOTIFICATION_ID, notification());
        if (!requestFocus()) { pausePlayback(); return; }
        playing = true;
        if (wake != null && !wake.isHeld()) wake.acquire();
        if (deadline == 0 && minutes > 0) deadline = System.currentTimeMillis() + minutes * 60000L;
        load(track);
        handler.removeCallbacks(tick);
        handler.post(tick);
        refreshNotification();
    }

    private boolean requestFocus() {
        if (mixAudio) { manager.abandonAudioFocusRequest(focus); duck = 1; return true; }
        return manager.requestAudioFocus(focus) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    private void pausePlayback() {
        playing = false;
        resumeAfterFocusLoss = false;
        deadline = 0;
        minutes = 0;
        generation++;
        handler.removeCallbacks(tick);
        release(player);
        release(retiring);
        player = null;
        retiring = null;
        if (wake != null && wake.isHeld()) wake.release();
        if (manager != null && focus != null) manager.abandonAudioFocusRequest(focus);
        if (session != null && running) refreshNotification();
    }

    private void pauseForFocusLoss() {
        if (!playing) return;
        resumeAfterFocusLoss = true;
        playing = false;
        generation++;
        handler.removeCallbacks(tick);
        release(player);
        release(retiring);
        player = null;
        retiring = null;
        if (wake != null && wake.isHeld()) wake.release();
        if (session != null && running) refreshNotification();
        handler.post(tick);
    }

    private void changeTrack(int delta) {
        int next = (trackIndex() + delta + IDS.length) % IDS.length;
        track = IDS[next];
        refreshNotification();
        if (playing) load(track);
    }

    private void cycleTimer() {
        int next = 0;
        while (next < TIMER_MODES.length && TIMER_MODES[next] != minutes) next++;
        minutes = TIMER_MODES[(next + 1) % TIMER_MODES.length];
        deadline = playing && minutes > 0 ? System.currentTimeMillis() + minutes * 60000L : 0;
        if (playing) { handler.removeCallbacks(tick); handler.post(tick); }
        refreshNotification();
    }

    private void refreshNotification() {
        if (session != null) {
            Bitmap art = coverArt();
            session.setMetadata(new MediaMetadata.Builder()
                    .putString(MediaMetadata.METADATA_KEY_TITLE, NAMES[trackIndex()])
                    .putString(MediaMetadata.METADATA_KEY_DISPLAY_TITLE, NAMES[trackIndex()])
                    .putString(MediaMetadata.METADATA_KEY_ARTIST, "自然入眠")
                    .putBitmap(MediaMetadata.METADATA_KEY_ART, art)
                    .putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, art)
                    .build());
            session.setActive(true);
        }
        if (running) try { getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notification()); }
        catch (Exception error) { Log.w("NatureSleep", "Notification refresh failed", error); }
    }

    private void stop() { pausePlayback(); stopForeground(STOP_FOREGROUND_REMOVE); stopSelf(); }
    private static void release(AudioTrack audio) { if (audio != null) { try { audio.stop(); } catch (Exception ignored) { } audio.release(); } }

    @Override public void onDestroy() {
        destroyed = true;
        pausePlayback();
        running = false;
        loader.shutdown();
        if (session != null) session.release();
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}

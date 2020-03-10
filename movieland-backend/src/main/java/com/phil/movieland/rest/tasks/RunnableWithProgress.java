package com.phil.movieland.rest.tasks;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Runnable with Progress data
 */
public abstract class RunnableWithProgress implements Runnable {
    private AtomicInteger progress=new AtomicInteger(0);
    private AtomicInteger progressMax=new AtomicInteger(100);

    public void incProgress(int inc) {
        progress.addAndGet(inc);
    }

    public int getProgress() {
        return progress.get();
    }

    public void setProgress(int progress) {
        this.progress.set(progress);
    }

    public int getProgressMax() {
        return progressMax.get();
    }

    public void setProgressMax(int progressMax) {
        this.progressMax.set(progressMax);
    }
}

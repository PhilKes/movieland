package com.phil.movieland.rest.tasks;

/**
 * Progress of a Task
 */
public class TaskProgress {
    private Integer progress;
    private Integer progressMax;
    private int taskId;
    private String message;

    public TaskProgress() {
    }

    public TaskProgress(Integer progressMax, Integer progress, int taskId, String message) {
        this.progressMax=progressMax;
        this.progress=progress;
        this.taskId=taskId;
        this.message=message;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress=progress;
    }

    public Integer getProgressMax() {
        return progressMax;
    }

    public void setProgressMax(Integer progressMax) {
        this.progressMax=progressMax;
    }

    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId=taskId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message=message;
    }
}

package com.phil.movieland.tasks;

import com.phil.movieland.tasks.RunnableWithProgress;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class TaskService {

    private ExecutorService executor;
    private List<RunnableWithProgress> taskList=new ArrayList<>();

    public TaskService() {
        this.executor=Executors.newFixedThreadPool(5);
    }

    public int execute(RunnableWithProgress runnable) {
        executor.execute(runnable);
        taskList.add(runnable);
        return taskList.size() - 1;
    }

    public TaskProgress getTaskProgress(int taskId) {
        if(taskId>taskList.size()) {
            return null;
        }
        RunnableWithProgress task=taskList.get(taskId);
        return new TaskProgress(task.getProgressMax(), task.getProgress(), taskId, null);
    }

    public void removeTask(int taskId) {
        taskList.set(taskId, null);
    }
}

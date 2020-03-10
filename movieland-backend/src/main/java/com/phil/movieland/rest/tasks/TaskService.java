package com.phil.movieland.rest.tasks;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Service to manage asnyc REST Tasks in ThreadPool
 */
@Service
public class TaskService {

    private ExecutorService executor;
    private List<RunnableWithProgress> taskList=new ArrayList<>();
    private List<Integer> finishedTaskIds=new ArrayList<>();

    public TaskService() {
        this.executor=Executors.newFixedThreadPool(5);
    }

    /**
     * Execute task in ThreadPool and return taskId
     */
    public int execute(RunnableWithProgress runnable) {
        executor.execute(runnable);
        int taskId;
        if(finishedTaskIds.size()>0) {
            taskId=finishedTaskIds.remove(0);
            taskList.set(taskId, runnable);
        }
        else {
            taskList.add(runnable);
            taskId=taskList.size() - 1;
        }
        return taskId;
    }

    /** Return current Progress of Task*/
    public TaskProgress getTaskProgress(int taskId) {
        if(taskId>taskList.size()) {
            return null;
        }
        RunnableWithProgress task=taskList.get(taskId);
        return new TaskProgress(task.getProgressMax(), task.getProgress(), taskId, null);
    }

    public void removeTask(int taskId) {
        taskList.set(taskId, null);
        finishedTaskIds.add(taskId);
    }
}

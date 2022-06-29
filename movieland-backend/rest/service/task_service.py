from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from typing import List, Any, Dict

from marshmallow import fields

from db.database import db, ma
from db.model import MovieShow, Reservation, Seat
from logger import get_logger

log = get_logger()


class TaskProgress:

    def __init__(self, progress_max: int, progress: int, task_id: int, message: str):
        self.progress_max = progress_max
        self.progress = progress
        self.task_id = task_id
        self.message = message


class TaskProgressSchema(ma.Schema):
    class Meta:
        model = TaskProgress

    progressMax = fields.Integer(attribute='progress_max')
    progress = fields.Integer()
    taskId = fields.Integer(attribute='task_id')
    message = fields.String()


task_progress_schema = TaskProgressSchema()


class RunnableWithProgress:
    progress_max: int = 100
    progress: int = 0
    message: str = None
    runnable = None
    args: Dict[str,Any]


class TasksService:
    task_list: List[RunnableWithProgress] = []
    finished_task_ids: List[int] = []
    executor: ThreadPoolExecutor = ThreadPoolExecutor(max_workers=3)

    def execute(self, runnable: RunnableWithProgress) -> int:
        log.info(f"Executing Task '{runnable.message}'")
        task_id = None

        self.executor.submit(runnable.runnable, **runnable.args)

        if len(self.finished_task_ids) > 0:
            task_id = self.finished_task_ids.pop(len(self.finished_task_ids) - 1)
            self.task_list[task_id] = runnable
        else:
            self.task_list.append(runnable)
            task_id = len(self.task_list) - 1
        return task_id

    def get_task_progress(self, task_id: int) -> TaskProgress:
        if task_id > len(self.task_list):
            return None
        task = self.task_list[task_id]
        if task is None:
            return None
        return TaskProgress(task.progress_max, task.progress, task_id, task.message)

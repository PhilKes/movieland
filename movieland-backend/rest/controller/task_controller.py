from flask_restx import Namespace, Resource

from logger import get_logger
from rest.service.statistics_service import StatisticsService
from rest.service.task_service import TasksService, task_progress_schema

api = Namespace('task', path='/tasks', description='Tasks')

log = get_logger()
service = TasksService()
stats_service = StatisticsService()


@api.route("/<int:taskId>")
@api.param("taskId", "Task identifier")
class TaskController(Resource):

    def get(self, taskId: int):
        return task_progress_schema.dump(service.get_task_progress(taskId)), 200
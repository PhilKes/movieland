"""
REST Controller classes to expose HTTP Mappings
"""

from .movie_controller import api as movie_api
from .movie_show_controller import api as movie_show_api
from .reservation_controller import api as reservation_api
from .auth_controller import api as auth_api
from .user_controller import api as user_api
from .seat_controller import api as seat_api
from .task_controller import api as task_api
from .statistics_controller import api as stats_api
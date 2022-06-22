"""
Error Handling to return useful Responses
"""

import sqlalchemy.exc
from flask import Flask

from logger import get_logger

log = get_logger()


def handle_db_integrity_error(e: sqlalchemy.exc.IntegrityError):
    msg = e.args[0][e.args[0].find("DETAIL"):]
    return {"msg": msg}, 400


def add_error_handlers(app: Flask):
    app.register_error_handler(sqlalchemy.exc.IntegrityError, handle_db_integrity_error)

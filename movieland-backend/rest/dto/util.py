from datetime import datetime


def get_datetime(text: str, format: str) -> datetime:
    """
    Converts given text to datetime object
    :param format: Date string format of text param
    """
    return datetime.strptime(text, format)

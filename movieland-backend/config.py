from configparser import ConfigParser

config = ConfigParser()
config.read('application.ini')


def get_config(key: str) -> str:
    return config.get('Config', key)

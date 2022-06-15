import logging
import sys

log_handler = logging.StreamHandler(sys.stdout)
log_handler.setFormatter(logging.Formatter(f'%(asctime)s %(levelname)s %(name)s : %(message)s'))


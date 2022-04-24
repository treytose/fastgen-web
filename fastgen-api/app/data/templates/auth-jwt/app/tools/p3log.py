import os, logging, time, traceback
from logging.handlers import RotatingFileHandler

class P3Log:
    def __init__(self, filename="app", path="/var/log/apps", debug=False):
        self.debug = debug
        try:
            if not os.path.lexists(path):
                os.mkdir(path)
        except Exception as e:
            print("Log path does not exist: " + str(e))

        filename = filename + ".log" if not filename.endswith(".log") else filename
        self.log_path = os.path.join(path, filename)
        self.logger = logging.getLogger(__name__)

        
        max_bytes = 50 * (2**20) # 50Mb 
        handler = RotatingFileHandler(self.log_path, maxBytes=max_bytes, backupCount=2)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO) # Will not log normal logs without this

    def log(self, message):       
        if self.debug:
            print(message)
        self.logger.info(str(message))    

    def log_warning(self, message):
        if self.debug:
            print(message)
        self.logger.warning(str(message))

    def log_error(self, message):
        if self.debug:
            print(message)
        self.logger.error(str(message))


if __name__ == '__main__':
    oLog = P3Log("test.log")
    oLog.log("TEST Info")
    oLog.log_warning("TEST WARNING")
    oLog.log_error("TEST ERROR")
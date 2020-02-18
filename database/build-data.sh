#!/bin/bash
if ! mysql -e "use movieland_db";
    then
        echo "building MYSQL schema + default data"
        mysqld --init-file="/database/schema-and-data.sql"
        #mysql -u "root" "movielandadmin" < "filename.sql"
    else
        echo "MYSQL Schema already set up."
fi

#!/bin/bash

docker run -d -p 80:80 -v "$PWD":/usr/local/apache2/htdocs/:Z httpd

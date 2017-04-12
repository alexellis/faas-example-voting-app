# FaaS conversion of Docker Voting app

This is very similar to [Docker's example voting app](https://github.com/docker/example-voting-app), except instead of using a message queue and worker, it calls a FaaS function to process votes in the background.

The FaaS function being used is in `process-vote/handler.js`, and it is called from `vote/app.py`.

## Getting started

Download [Docker for Mac or Windows](https://www.docker.com).

Find out more about [FaaS](https://github.com/alexellis/faas)

Run in this directory:

    $ docker stack deploy func -c ./docker-compose.yml

The app will be running at [http://localhost:5000](http://localhost:5000), and the results will be at [http://localhost:5001](http://localhost:5001).

The API gateway will run at [http://localhost:8080](http://localhost:8080)


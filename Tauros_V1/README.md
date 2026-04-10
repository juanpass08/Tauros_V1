# Markdown syntax guide

This is just a brief summary of how to run the agent. (And some hints...)

## Pre-Installation
We strongly recommend follow this documentations about creating agents for first time:
https://codelabs.developers.google.com/bigquery-adk-eval#0$0 & https://adk.dev/runtime/api-server/$0

The commands listed here were set to follow in the Cloud shell (GCP) but you can also run a local terminal.

Open your Agent root directory (in this case:Agent-BigQuery) and run the following commands:

1. Create a virtual Python environment:

```
python -m venv .venv
```
2. Activate the virtual environment:

```
source .venv/bin/activate
```
3. Activate the virtual environment:

```
pip install google-adk google-cloud-aiplatform[evaluation] pandas
```
4. You will need to know the URL were the agent will run. You simple run and copy the URL from the search bar on your browser when you run the command.
```
adk web
```

## Installation
From here, you will at least 2 terminals running at the same time.

### Terminal 1
You will need to run:
```
adk api_server --host 0.0.0.0 --port 8000 --allow_origins "https://8000-cs-1099027051614-default.cs-us-central1-pits.cloudshell.dev"
```
*You will need to replace the URL from yours. See the last Pre-Installation step for more info.*

### Terminal 2
Leave the terminal 1 running and on the second terminal run:
```
python3 proxy_server.py
```

## Test your Agent
In any console, change the port in the console to 5500.

To change the port, go to your console and the push the "Web Preview" button, should be in the top right corner and then, change the port to 5500. finally click on "Preview the port".
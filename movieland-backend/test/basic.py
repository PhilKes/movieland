import requests

BASE = "http://localhost:8080/api"

response = requests.get(BASE + '/movies')
print(response.json())

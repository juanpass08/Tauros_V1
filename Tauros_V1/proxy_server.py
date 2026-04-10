import http.server
import urllib.request
import urllib.error
import json

PORT = 5500
AGENT_URL = "http://localhost:8000"
APP_NAME = "bigquery_tool_agent"
USER_ID = "valenciacortez_test"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/execute':
            content_length = int(self.headers['Content-Length'])
            raw_data = self.rfile.read(content_length)
            user_payload = json.loads(raw_data)

            session_id = user_payload.get("sessionId", "s_1")
            message = user_payload.get("message", "")

            reg_path = f"/apps/{APP_NAME}/users/{USER_ID}/sessions/{session_id}"
            self.request_to_agent(reg_path, {})

            payload = {
                "new_message": {
                    "parts": [
                        {"text": message}
                    ]
                },
                "appName": APP_NAME,
                "userId": USER_ID,
                "sessionId": session_id
            }

            print(f"--- Send Estructure to Agent---")
            status, body = self.request_to_agent("/run", payload)

            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_POST()

    def request_to_agent(self, path, data_dict):
        url = f"{AGENT_URL}{path}"
        body = json.dumps(data_dict).encode('utf-8')
        req = urllib.request.Request(url, data=body, method='POST')
        req.add_header('Content-Type', 'application/json')
        try:
            with urllib.request.urlopen(req) as res:
                return res.status, res.read()
        except urllib.error.HTTPError as e:
            return e.code, e.read()
        except Exception as e:
            return 500, json.dumps({"error": str(e)}).encode()

if __name__ == '__main__':
    print(f"Active Port: {PORT}")
    http.server.HTTPServer(('0.0.0.0', PORT), ProxyHandler).serve_forever()
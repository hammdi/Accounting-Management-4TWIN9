from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Module is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)  # Bind to 0.0.0.0 to allow external access

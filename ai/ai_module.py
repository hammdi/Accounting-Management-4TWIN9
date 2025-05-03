from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def predict_fraud(amount, transaction_time, merchant_category, merchant_country, card_type, transaction_type):
    """
    Predict fraud risk for a transaction.
    
    Args:
        amount: Transaction amount
        transaction_time: Transaction timestamp
        merchant_category: Merchant category
        merchant_country: Merchant country
        card_type: Payment card type
        transaction_type: Transaction type
        
    Returns:
        dict: Prediction result with risk score and recommendation
    """
    
    # Initialize risk score
    risk_score = 0
    
    # Amount-based risk
    if amount > 1000:
        risk_score += 3
    elif amount > 500:
        risk_score += 2
    elif amount > 100:
        risk_score += 1
    
    # Country-based risk
    high_risk_countries = ['Nigeria', 'Russia', 'China']
    if merchant_country in high_risk_countries:
        risk_score += 3
    
    # Card type risk
    high_risk_cards = ['prepaid', 'virtual']
    if card_type.lower() in high_risk_cards:
        risk_score += 2
    
    # Transaction time risk (suspicious late-night transactions)
    try:
        hour = int(transaction_time.split('T')[1].split(':')[0])
        if hour < 6 or hour > 22:  # Late night/early morning
            risk_score += 2
    except:
        pass
    
    # Normalize risk score to be between 0 and 1
    max_possible_score = 10  # Maximum possible score based on our rules
    normalized_score = risk_score / max_possible_score
    
    # Determine recommendation based on normalized score
    if normalized_score >= 0.7:
        recommendation = "Reject"
    elif normalized_score >= 0.3:
        recommendation = "Review"
    else:
        recommendation = "Approve"
    
    return {
        "risk_score": normalized_score,
        "recommendation": recommendation,
        "confidence": (1 - abs(normalized_score - 0.5)) * 100,
        "is_fraud": normalized_score >= 0.7
    }

@app.route("/api/fraud/predict", methods=["POST"])
def predict_fraud_route():
    try:
        data = request.json
        result = predict_fraud(
            amount=data.get("amount"),
            transaction_time=data.get("transaction_time"),
            merchant_category=data.get("merchant_category"),
            merchant_country=data.get("merchant_country"),
            card_type=data.get("card_type"),
            transaction_type=data.get("transaction_type")
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Module is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

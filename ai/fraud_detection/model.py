import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier
import pickle
import os

class FraudDetector:
    def __init__(self):
        self.model = None
        self.pipeline = None
        self.feature_columns = [
            'amount', 'merchant_category', 'merchant_type', 'merchant', 
            'country', 'city_size', 'card_type', 'card_present', 
            'channel', 'distance_from_home', 'high_risk_merchant', 
            'transaction_hour', 'weekend_transaction', 'velocity_last_hour'
        ]
        
    def preprocess(self, df):
        # Handle missing values
        df = df.fillna({
            'amount': df['amount'].mean(),
            'distance_from_home': df['distance_from_home'].mean(),
            'velocity_last_hour': df['velocity_last_hour'].apply(lambda x: eval(x)['num_transactions'])
        })
        
        # Convert categorical variables
        categorical_cols = ['merchant_category', 'merchant_type', 'merchant', 
                          'country', 'city_size', 'card_type', 'card_present', 
                          'channel', 'high_risk_merchant', 'weekend_transaction']
        
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            
        # Extract hour from timestamp
        df['transaction_hour'] = pd.to_datetime(df['timestamp']).dt.hour
        
        # Convert velocity to numeric
        df['velocity_last_hour'] = df['velocity_last_hour'].apply(lambda x: eval(x)['num_transactions'])
            
        return df
    
    def train(self, X, y):
        # Create preprocessing pipeline
        preprocessor = Pipeline([
            ('imputer', SimpleImputer(strategy='mean')),
            ('scaler', StandardScaler())
        ])
        
        # Create and train the model
        self.model = XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            objective='binary:logistic',
            random_state=42
        )
        
        # Create full pipeline
        self.pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('model', self.model)
        ])
        
        # Train the model
        self.pipeline.fit(X, y)
        
    def predict(self, X):
        # Preprocess the data
        X = self.preprocess(X)
        # Make predictions
        predictions = self.pipeline.predict_proba(X)[:, 1]
        return predictions
    
    def save_model(self, path='models/fraud_detector.pkl'):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self.pipeline, f)
            
    def load_model(self, path='models/fraud_detector.pkl'):
        with open(path, 'rb') as f:
            self.pipeline = pickle.load(f)

# Example usage
if __name__ == "__main__":
    # Initialize the detector
    detector = FraudDetector()
    
    # Load your training data
    df = pd.read_csv("subset_dataset.csv")
    
    # Preprocess the data
    processed_df = detector.preprocess(df)
    
    # Get features and target
    X = processed_df[detector.feature_columns]
    y = processed_df['is_fraud']
    
    # Train the model
    detector.train(X, y)
    
    # Save the model
    detector.save_model()
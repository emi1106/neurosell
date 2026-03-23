"""
Price Recommendation System - Real Dataset
Trains Decision Tree and MLP models using the Mercari cleaned dataset
"""

import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pickle
import warnings
warnings.filterwarnings('ignore')


class PriceRecommendationSystem:
    """Price recommendation system using real Mercari dataset"""
    
    def __init__(self):
        self.dt_model = None
        self.mlp_model = None
        self.rf_model = None
        self.gb_model = None
        self.le_dict = {}
        self.scaler = None
        self.feature_names = []
        self.class_names = {
            0: 'T-shirt/top',
            1: 'Trouser',
            2: 'Pullover',
            3: 'Dress',
            4: 'Coat',
            5: 'Sandal',
            6: 'Shirt',
            7: 'Sneaker',
            8: 'Bag',
            9: 'Ankle boot'
        }
    
    def load_and_preprocess_data(self, filepath: str, sample_fraction: float = 1.0) -> pd.DataFrame:
        """
        Load and preprocess the Mercari dataset.
        
        Parameters:
        -----------
        filepath : str
            Path to the CSV file
        sample_fraction : float
            Fraction of data to use (for faster training)
            
        Returns:
        --------
        pd.DataFrame : Preprocessed dataset
        """
        print(f"Loading dataset from {filepath}...")
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} rows")
        
        # Sample if needed
        if sample_fraction < 1.0:
            df = df.sample(frac=sample_fraction, random_state=42)
            print(f"Using {len(df)} rows ({sample_fraction*100:.0f}% of total)")
        
        # Remove invalid prices
        df = df[(df['price'] > 0) & (df['price'] <= 1000)].copy()
        print(f"After price filtering: {len(df)} rows\n")
        
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> tuple:
        """
        Create features for the model.
        
        Parameters:
        -----------
        df : pd.DataFrame
            Raw dataset
            
        Returns:
        --------
        tuple : (X, y, feature_names)
        """
        print("=" * 80)
        print("FEATURE ENGINEERING")
        print("=" * 80)
        
        X = pd.DataFrame()
        
        # 1. Fashion-MNIST Class (product type)
        print("\n1. Fashion-MNIST Class (product type)")
        X['fashion_mnist_class'] = df['fashion_mnist_class']
        
        # 2. Brand Name
        print("2. Brand Name")
        X['brand_name'] = df['brand_name']
        
        # 3. Item Condition
        print("3. Item Condition")
        X['item_condition_id'] = df['item_condition_id']
        
        # 4. Shipping
        print("4. Shipping")
        X['shipping'] = df['shipping']
        
        # 5. Product Name Features
        print("5. Product Name Features")
        X['name_length'] = df['name'].str.len()
        X['name_word_count'] = df['name'].str.split().str.len()
        
        # 6. Description Features
        print("6. Item Description Features")
        X['description_length'] = df['item_description'].str.len()
        X['description_word_count'] = df['item_description'].str.split().str.len()
        X['description_has_excellent'] = df['item_description'].str.lower().str.contains('excellent|perfect|pristine|like new').astype(int)
        X['description_has_flaw'] = df['item_description'].str.lower().str.contains('flaw|stain|tear|hole|damage').astype(int)
        
        # 7. Brand Frequency
        print("7. Brand Frequency")
        brand_counts = df['brand_name'].value_counts()
        X['brand_frequency'] = df['brand_name'].map(brand_counts).fillna(1)
        
        # Top 30 brands - one-hot encode
        print("8. Top 30 Brands One-Hot Encoding")
        top_brands = brand_counts.head(30).index.tolist()
        for brand in top_brands:
            brand_col_name = f"brand_{brand.replace(' ', '_').replace('-', '_')[:20]}"
            X[brand_col_name] = (df['brand_name'] == brand).astype(int)
        
        self.feature_names = X.columns.tolist()
        y = df['price'].copy()
        
        print(f"\nTotal features created: {len(self.feature_names)}")
        print(f"Target variable (price) - Mean: ${y.mean():.2f}, Std: ${y.std():.2f}\n")
        
        return X, y
    
    def train(self, df: pd.DataFrame, test_size: float = 0.2, random_seed: int = 42) -> dict:
        """
        Train multiple models on the dataset.
        
        Parameters:
        -----------
        df : pd.DataFrame
            Preprocessed dataset
        test_size : float
            Proportion of data for testing
        random_seed : int
            Random seed for reproducibility
            
        Returns:
        --------
        dict : Training metrics for all models
        """
        print("=" * 80)
        print("FEATURE ENGINEERING AND ENCODING")
        print("=" * 80)
        
        X, y = self.engineer_features(df)
        
        # Encode categorical variables
        print("Encoding categorical variables...")
        X_encoded = X.copy()
        for col in X_encoded.columns:
            if X_encoded[col].dtype == 'object':
                le = LabelEncoder()
                X_encoded[col] = le.fit_transform(X_encoded[col])
                self.le_dict[col] = le
        
        # Handle missing values
        X_encoded = X_encoded.fillna(0)
        
        # Split data
        print(f"Splitting data: {100-test_size*100:.0f}% train, {test_size*100:.0f}% test")
        X_train, X_test, y_train, y_test = train_test_split(
            X_encoded, y, test_size=test_size, random_state=random_seed
        )
        
        # Scale features
        print("Scaling features...")
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print(f"\nTraining set: {len(X_train)} samples")
        print(f"Testing set: {len(X_test)} samples\n")
        
        # ====================================================================
        # MODEL TRAINING
        # ====================================================================
        print("=" * 80)
        print("MODEL TRAINING")
        print("=" * 80)
        
        metrics = {'samples': {'train': len(X_train), 'test': len(X_test)}}
        
        # 1. Decision Tree
        print("\n1. Decision Tree Regressor")
        print("-" * 40)
        self.dt_model = DecisionTreeRegressor(max_depth=15, min_samples_split=50, random_state=random_seed)
        self.dt_model.fit(X_train_scaled, y_train)
        dt_pred_test = self.dt_model.predict(X_test_scaled)
        dt_pred_train = self.dt_model.predict(X_train_scaled)
        
        metrics['dt'] = {
            'train_rmse': np.sqrt(mean_squared_error(y_train, dt_pred_train)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, dt_pred_test)),
            'train_mae': mean_absolute_error(y_train, dt_pred_train),
            'test_mae': mean_absolute_error(y_test, dt_pred_test),
            'train_r2': r2_score(y_train, dt_pred_train),
            'test_r2': r2_score(y_test, dt_pred_test),
        }
        print(f"Train RMSE: ${metrics['dt']['train_rmse']:.2f}")
        print(f"Test RMSE:  ${metrics['dt']['test_rmse']:.2f}")
        print(f"Train MAE:  ${metrics['dt']['train_mae']:.2f}")
        print(f"Test MAE:   ${metrics['dt']['test_mae']:.2f}")
        print(f"Train R²:   {metrics['dt']['train_r2']:.4f}")
        print(f"Test R²:    {metrics['dt']['test_r2']:.4f}")
        
        # 2. MLP Neural Network
        print("\n2. MLP Neural Network")
        print("-" * 40)
        self.mlp_model = MLPRegressor(
            hidden_layer_sizes=(128, 64, 32),
            max_iter=500,
            learning_rate_init=0.001,
            random_state=random_seed,
            early_stopping=True,
            validation_fraction=0.1,
            verbose=0
        )
        self.mlp_model.fit(X_train_scaled, y_train)
        mlp_pred_test = self.mlp_model.predict(X_test_scaled)
        mlp_pred_train = self.mlp_model.predict(X_train_scaled)
        
        metrics['mlp'] = {
            'train_rmse': np.sqrt(mean_squared_error(y_train, mlp_pred_train)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, mlp_pred_test)),
            'train_mae': mean_absolute_error(y_train, mlp_pred_train),
            'test_mae': mean_absolute_error(y_test, mlp_pred_test),
            'train_r2': r2_score(y_train, mlp_pred_train),
            'test_r2': r2_score(y_test, mlp_pred_test),
        }
        print(f"Train RMSE: ${metrics['mlp']['train_rmse']:.2f}")
        print(f"Test RMSE:  ${metrics['mlp']['test_rmse']:.2f}")
        print(f"Train MAE:  ${metrics['mlp']['train_mae']:.2f}")
        print(f"Test MAE:   ${metrics['mlp']['test_mae']:.2f}")
        print(f"Train R²:   {metrics['mlp']['train_r2']:.4f}")
        print(f"Test R²:    {metrics['mlp']['test_r2']:.4f}")
        
        # 3. Random Forest
        print("\n3. Random Forest Regressor")
        print("-" * 40)
        self.rf_model = RandomForestRegressor(n_estimators=50, max_depth=15, random_state=random_seed, n_jobs=-1)
        self.rf_model.fit(X_train_scaled, y_train)
        rf_pred_test = self.rf_model.predict(X_test_scaled)
        rf_pred_train = self.rf_model.predict(X_train_scaled)
        
        metrics['rf'] = {
            'train_rmse': np.sqrt(mean_squared_error(y_train, rf_pred_train)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, rf_pred_test)),
            'train_mae': mean_absolute_error(y_train, rf_pred_train),
            'test_mae': mean_absolute_error(y_test, rf_pred_test),
            'train_r2': r2_score(y_train, rf_pred_train),
            'test_r2': r2_score(y_test, rf_pred_test),
        }
        print(f"Train RMSE: ${metrics['rf']['train_rmse']:.2f}")
        print(f"Test RMSE:  ${metrics['rf']['test_rmse']:.2f}")
        print(f"Train MAE:  ${metrics['rf']['train_mae']:.2f}")
        print(f"Test MAE:   ${metrics['rf']['test_mae']:.2f}")
        print(f"Train R²:   {metrics['rf']['train_r2']:.4f}")
        print(f"Test R²:    {metrics['rf']['test_r2']:.4f}")
        
        # 4. Gradient Boosting
        print("\n4. Gradient Boosting Regressor")
        print("-" * 40)
        self.gb_model = GradientBoostingRegressor(n_estimators=50, max_depth=5, learning_rate=0.1, random_state=random_seed)
        self.gb_model.fit(X_train_scaled, y_train)
        gb_pred_test = self.gb_model.predict(X_test_scaled)
        gb_pred_train = self.gb_model.predict(X_train_scaled)
        
        metrics['gb'] = {
            'train_rmse': np.sqrt(mean_squared_error(y_train, gb_pred_train)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, gb_pred_test)),
            'train_mae': mean_absolute_error(y_train, gb_pred_train),
            'test_mae': mean_absolute_error(y_test, gb_pred_test),
            'train_r2': r2_score(y_train, gb_pred_train),
            'test_r2': r2_score(y_test, gb_pred_test),
        }
        print(f"Train RMSE: ${metrics['gb']['train_rmse']:.2f}")
        print(f"Test RMSE:  ${metrics['gb']['test_rmse']:.2f}")
        print(f"Train MAE:  ${metrics['gb']['train_mae']:.2f}")
        print(f"Test MAE:   ${metrics['gb']['test_mae']:.2f}")
        print(f"Train R²:   {metrics['gb']['train_r2']:.4f}")
        print(f"Test R²:    {metrics['gb']['test_r2']:.4f}")
        
        # ====================================================================
        # FEATURE IMPORTANCE
        # ====================================================================
        print("\n" + "=" * 80)
        print("TOP 15 MOST IMPORTANT FEATURES (Random Forest)")
        print("=" * 80)
        
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.rf_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n")
        for idx, (_, row) in enumerate(feature_importance.head(15).iterrows(), 1):
            print(f"{idx:2}. {row['feature']:<40} - {row['importance']:.4f}")
        
        return metrics, X_test_scaled, y_test
    
    def save_models(self, filepath_prefix: str = '/home/z/Desktop/hackaton/mercari_price_models'):
        """Save all trained models to disk."""
        try:
            with open(f'{filepath_prefix}.pkl', 'wb') as f:
                pickle.dump({
                    'dt_model': self.dt_model,
                    'mlp_model': self.mlp_model,
                    'rf_model': self.rf_model,
                    'gb_model': self.gb_model,
                    'scaler': self.scaler,
                    'le_dict': self.le_dict,
                    'feature_names': self.feature_names,
                    'class_names': self.class_names
                }, f)
            print(f"\n✓ All models saved to {filepath_prefix}.pkl")
        except Exception as e:
            print(f"Error saving models: {e}")
    
    def load_models(self, filepath_prefix: str = '/home/z/Desktop/hackaton/mercari_price_models'):
        """Load trained models from disk."""
        try:
            with open(f'{filepath_prefix}.pkl', 'rb') as f:
                data = pickle.load(f)
                self.dt_model = data['dt_model']
                self.mlp_model = data['mlp_model']
                self.rf_model = data['rf_model']
                self.gb_model = data['gb_model']
                self.scaler = data['scaler']
                self.le_dict = data['le_dict']
                self.feature_names = data['feature_names']
                self.class_names = data['class_names']
            print(f"✓ Models loaded from {filepath_prefix}.pkl")
        except Exception as e:
            print(f"Error loading models: {e}")


def main():
    """Main execution function"""
    print("=" * 80)
    print("MERCARI PRICE RECOMMENDATION SYSTEM - REAL DATASET TRAINING")
    print("=" * 80)
    
    # Initialize system
    system = PriceRecommendationSystem()
    
    # Load and preprocess data
    print("\n1. LOADING AND PREPROCESSING DATA")
    print("=" * 80)
    df = system.load_and_preprocess_data(
        '/home/z/Desktop/hackaton/neuro_dataset.csv',
        sample_fraction=0.5  # Use 50% for faster training
    )
    
    print(f"Price range: ${df['price'].min():.2f} - ${df['price'].max():.2f}")
    print(f"Average price: ${df['price'].mean():.2f}")
    print(f"Median price: ${df['price'].median():.2f}\n")
    
    # Train models
    print("2. TRAINING MODELS")
    metrics, X_test, y_test = system.train(df)
    
    # Model comparison
    print("\n" + "=" * 80)
    print("MODEL COMPARISON (TEST SET)")
    print("=" * 80)
    print(f"\n{'Model':<20} {'RMSE':<12} {'MAE':<12} {'R² Score':<12}")
    print("-" * 56)
    
    for model_name in ['dt', 'mlp', 'rf', 'gb']:
        if model_name in metrics:
            rmse = metrics[model_name]['test_rmse']
            mae = metrics[model_name]['test_mae']
            r2 = metrics[model_name]['test_r2']
            print(f"{model_name.upper():<20} ${rmse:<11.2f} ${mae:<11.2f} {r2:<12.4f}")
    
    # Find best model
    best_model = min(['dt', 'mlp', 'rf', 'gb'], key=lambda x: metrics[x]['test_rmse'] if x in metrics else float('inf'))
    print("-" * 56)
    print(f"\n✓ Best Model: {best_model.upper()} with RMSE ${metrics[best_model]['test_rmse']:.2f}")
    
    # Generate predictions CSV
    print("\n4. GENERATING PREDICTIONS CSV")
    print("=" * 80)
    
    # Make predictions with best model
    if best_model == 'dt':
        y_pred = system.dt_model.predict(X_test)
    elif best_model == 'mlp':
        y_pred = system.mlp_model.predict(X_test)
    elif best_model == 'rf':
        y_pred = system.rf_model.predict(X_test)
    else:  # gb
        y_pred = system.gb_model.predict(X_test)
    
    # Create predictions dataframe
    predictions_df = pd.DataFrame({
        'actual_price': y_test.values,
        'predicted_price': y_pred,
        'absolute_error': np.abs(y_test.values - y_pred),
        'percentage_error': (np.abs(y_test.values - y_pred) / y_test.values * 100),
        'model': best_model.upper()
    }).sort_values('absolute_error')
    
    # Save predictions CSV
    csv_filename = f'/home/z/Desktop/hackaton/mercari_price_predictions_{best_model}.csv'
    predictions_df.to_csv(csv_filename, index=False)
    
    print(f"\n✓ Predictions saved to CSV file:")
    print(f"  Filename: mercari_price_predictions_{best_model}.csv")
    print(f"  Full path: {csv_filename}")
    print(f"  Total predictions: {len(predictions_df)}")
    print(f"  Average error: ${predictions_df['absolute_error'].mean():.2f}")
    print(f"  Median error: ${predictions_df['absolute_error'].median():.2f}")
    
    # Display sample predictions
    print(f"\nSample Predictions (Best {len(predictions_df) // 3} Performing):")
    print(predictions_df.head(5).to_string())
    
    # Save models
    print("\n5. SAVING MODELS")
    print("=" * 80)
    system.save_models()
    
    print("\n" + "=" * 80)
    print("✓ PRICE RECOMMENDATION SYSTEM TRAINED AND READY!")
    print("=" * 80)
    print(f"\nOutput Files Generated:")
    print(f"  1. CSV Predictions: mercari_price_predictions_{best_model}.csv")
    print(f"  2. Models: mercari_price_models.pkl")
    print("=" * 80)


if __name__ == '__main__':
    main()

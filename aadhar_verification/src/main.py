# src/main.py

import face_recognition
import numpy as np
from PIL import Image
import os
import cv2
from datetime import datetime

class ImageProcessor:
    @staticmethod
    def validate_image(image_path):
        """Validate if image exists and is readable"""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        try:
            img = Image.open(image_path)
            img.verify()
            return True
        except Exception as e:
            raise ValueError(f"Invalid image file: {str(e)}")

    @staticmethod
    def preprocess_image(image_path):
        """Preprocess image for better face detection"""
        # Read image
        image = cv2.imread(image_path)
        
        # Convert to RGB (face_recognition uses RGB)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Resize if too large
        max_size = 1920
        height, width = image.shape[:2]
        if height > max_size or width > max_size:
            scale = max_size / max(height, width)
            image = cv2.resize(image, (int(width * scale), int(height * scale)))
        
        # Enhance contrast
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        enhanced = cv2.merge((cl,a,b))
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
        
        return enhanced

class AadhaarVerifier:
    def __init__(self, threshold=0.6):
        self.threshold = threshold
        self.processor = ImageProcessor()
        
    def verify_identity(self, user_photo_path, aadhar_photo_path):
        """
        Verify if the person in the user photo matches the Aadhaar card photo
        
        Args:
            user_photo_path: Path to the user's current photo
            aadhar_photo_path: Path to the Aadhaar card photo
            
        Returns:
            dict: Verification results including match status and confidence
        """
        try:
            # Validate images
            self.processor.validate_image(user_photo_path)
            self.processor.validate_image(aadhar_photo_path)
            
            # Preprocess images
            user_image = self.processor.preprocess_image(user_photo_path)
            aadhar_image = self.processor.preprocess_image(aadhar_photo_path)
            
            # Detect faces
            user_face_locations = face_recognition.face_locations(user_image)
            aadhar_face_locations = face_recognition.face_locations(aadhar_image)
            
            # Check if faces were detected
            if not user_face_locations:
                return {
                    "success": False,
                    "message": "No face detected in user photo",
                    "confidence": 0.0
                }
            
            if not aadhar_face_locations:
                return {
                    "success": False,
                    "message": "No face detected in Aadhaar photo",
                    "confidence": 0.0
                }
            
            # Get face encodings
            user_encoding = face_recognition.face_encodings(user_image, user_face_locations)[0]
            aadhar_encoding = face_recognition.face_encodings(aadhar_image, aadhar_face_locations)[0]
            
            # Calculate face distance
            face_distance = face_recognition.face_distance([user_encoding], aadhar_encoding)[0]
            
            # Convert distance to similarity score (0 to 1)
            similarity = 1 - face_distance
            
            # Compare with threshold
            is_match = similarity >= self.threshold
            
            return {
                "success": True,
                "match": is_match,
                "confidence": round(similarity * 100, 2),
                "message": "Verification successful" if is_match else "Photos don't match",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error during verification: {str(e)}",
                "confidence": 0.0
            }

def main():
    # Initialize verifier
    verifier = AadhaarVerifier(threshold=0.6)
    
    # Example paths - replace with your actual image paths
    user_photo = os.path.join("images", "user_photos", "user.jpg")
    aadhar_photo = os.path.join("images", "aadhar_cards", "aadhar.jpg")
    
    # Perform verification
    result = verifier.verify_identity(user_photo, aadhar_photo)
    
    # Print results
    print("\nVerification Results:")
    print("-" * 50)
    print(f"Status: {'✓ Success' if result['success'] else '✗ Failed'}")
    if result['success']:
        print(f"Match: {'✓ Verified' if result['match'] else '✗ Not Verified'}")
        print(f"Confidence: {result['confidence']}%")
    print(f"Message: {result['message']}")
    if 'timestamp' in result:
        print(f"Timestamp: {result['timestamp']}")

if __name__ == "__main__":
    main()
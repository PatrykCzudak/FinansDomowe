#!/usr/bin/env python3
"""
Test script for Python FastAPI backend
"""
import requests
import json
import time

def test_backend():
    """Test all backend endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testowanie backend Python FastAPI...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Health check OK")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Test categories endpoint
    try:
        response = requests.get(f"{base_url}/api/categories")
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Categories OK - found {len(categories)} categories")
        else:
            print(f"❌ Categories failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Categories error: {e}")
    
    # Test incomes endpoint
    try:
        response = requests.get(f"{base_url}/api/incomes")
        if response.status_code == 200:
            incomes = response.json()
            print(f"✅ Incomes OK - found {len(incomes)} incomes")
        else:
            print(f"❌ Incomes failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Incomes error: {e}")
    
    # Test investments endpoint
    try:
        response = requests.get(f"{base_url}/api/investments")
        if response.status_code == 200:
            investments = response.json()
            print(f"✅ Investments OK - found {len(investments)} investments")
        else:
            print(f"❌ Investments failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Investments error: {e}")
    
    # Test API docs
    try:
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("✅ API Documentation accessible")
        else:
            print(f"❌ API docs failed: {response.status_code}")
    except Exception as e:
        print(f"❌ API docs error: {e}")
    
    print("\n🎉 Backend testing completed!")
    return True

if __name__ == "__main__":
    test_backend()
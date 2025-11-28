'''
Business: API для управления записями клиентов в салон
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными записей или статусом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        service_id = body_data.get('serviceId', '')
        service_name = body_data.get('serviceName', '')
        booking_date = body_data.get('date', '')
        booking_time = body_data.get('time', '')
        client_name = body_data.get('name', '')
        client_phone = body_data.get('phone', '')
        additional_message = body_data.get('message', '')
        
        if not all([service_id, service_name, booking_date, booking_time, client_name, client_phone]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Все обязательные поля должны быть заполнены'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('''
            INSERT INTO bookings (service_id, service_name, booking_date, booking_time, client_name, client_phone, additional_message, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        ''', (service_id, service_name, booking_date, booking_time, client_name, client_phone, additional_message, 'pending'))
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'id': result['id'],
                'message': 'Запись успешно создана',
                'createdAt': result['created_at'].isoformat()
            })
        }
    
    if method == 'GET':
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('''
            SELECT id, service_id, service_name, booking_date, booking_time, 
                   client_name, client_phone, additional_message, status, created_at
            FROM bookings
            ORDER BY booking_date DESC, booking_time DESC
        ''')
        
        bookings = cur.fetchall()
        cur.close()
        conn.close()
        
        bookings_list = []
        for booking in bookings:
            bookings_list.append({
                'id': booking['id'],
                'serviceId': booking['service_id'],
                'serviceName': booking['service_name'],
                'date': booking['booking_date'].isoformat(),
                'time': booking['booking_time'],
                'name': booking['client_name'],
                'phone': booking['client_phone'],
                'message': booking['additional_message'],
                'status': booking['status'],
                'createdAt': booking['created_at'].isoformat()
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'bookings': bookings_list})
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }

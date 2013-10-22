import serial

# RFID 


# blocking for now 
def check_login():
	return user_id


# Get user ID from server trough web API
import requests
import simplejson as json

def get_user_with_id(url,user_id):
	r = requests.get(url + '?user_id=' + user_id)
	if r.status_code == 200:
		return r.json()
	else:
		return False


import md5

def challenge_hash(user_id, challenge_id):
	m = md5.new()
	m.update(str(user_id) + str(challenge_id))
	return m.digest()

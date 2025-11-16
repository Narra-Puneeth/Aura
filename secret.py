import requests
from requests.auth import HTTPBasicAuth

# Your Fitbit app credentials
CLIENT_ID = "23TH8Q"
CLIENT_SECRET = "2f7295985ca053f7938b52d81cd2259d"
REDIRECT_URI = "http://localhost:8080/callback"

# The auth code you received
AUTH_CODE = "377ab1aeea3400c3a39f2248b655ce3eb339e7a8"

# Your PKCE code verifier
CODE_VERIFIER = "5a670h2u222u3m002q6p242y5n6z1r032c6g45054s2e1a2l3e2l2u5b1u3z021x250k266d716v1t1c0d6p1v2n0s3w2l303d326v3n141s722s5a6u5e1k392f5b19"

# Exchange code for access token
data = {
    "client_id": CLIENT_ID,
    "grant_type": "authorization_code",
    "redirect_uri": REDIRECT_URI,
    "code": AUTH_CODE,
    "code_verifier": CODE_VERIFIER
}

response = requests.post(
    "https://api.fitbit.com/oauth2/token",
    data=data,
    auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
)

print(response.json())

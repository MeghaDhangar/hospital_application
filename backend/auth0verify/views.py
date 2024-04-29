from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from jose import jwt
import requests

def validate_auth0_token(request):
    id_token  = request.headers.get('Authorization', '').split('Bearer ')[1]

    # Replace 'YOUR_AUTH0_DOMAIN' and 'YOUR_AUTH0_CLIENT_ID' with your Auth0 domain and client ID
    audience = 'https://dev-wk502078emf2n02u.us.auth0.com/api/v2/'
    auth0_domain = 'dev-wk502078emf2n02u.us.auth0.com'

    json_web_key_set_url = f'https://{auth0_domain}/.well-known/jwks.json'
    jwks = requests.get(json_web_key_set_url).json()

    unverified_header = jwt.get_unverified_header(id_token)
    rsa_key = {}

    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e'],
            }

    try:
        payload = jwt.decode(
             id_token,
            rsa_key,
            algorithms=['RS256'],
            audience=audience,
            issuer=f'https://{auth0_domain}/',
        )

        user_details = {
            'user_id': payload.get('sub'),
            'name': payload.get('name'),
            'email': payload.get('email'),
            # Add more user details as needed
        }
        # Token is valid, you can access claims in the 'payload' variable
        print(payload)
        return JsonResponse(user_details)
        # return JsonResponse({'message': 'Token is valid'})
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token has expired'}, status=401)
    except jwt.JWTClaimsError:
        return JsonResponse({'error': 'Invalid claims'}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'Unable to parse authentication token'}, status=400)


def get_auth0_user_profile(request):
  
  
    # Get the access token from the Authorization header
    access_token = request.headers.get('Authorization', '').split('Bearer ')[1]

    # Replace 'YOUR_AUTH0_DOMAIN' with your Auth0 domain
    auth0_domain = 'dev-wk502078emf2n02u.us.auth0.com'

    # Make a request to the Auth0 /userinfo endpoint
    userinfo_url = f'https://{auth0_domain}/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}

    try:
        response = requests.get(userinfo_url, headers=headers)
        response.raise_for_status()

        user_profile = response.json()
        user_metadata_url = f'https://{auth0_domain}/api/v2/users/{user_profile["sub"]}'
        user_metadata_response = requests.get(user_metadata_url, headers=headers)
        user_metadata_response.raise_for_status()

        user_metadata = user_metadata_response.json().get('user_metadata', {})

        # Merge user metadata into the user profile
        user_profile.update(user_metadata)

        # You can now access user details from the 'user_profile' variable
        return JsonResponse(user_profile)
    except requests.exceptions.HTTPError as err:
        return JsonResponse({'error': f'Error fetching user details: {err}'}, status=500)        


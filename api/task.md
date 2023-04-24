### Notice

Credentials = Username + password //Client Computer JWT

accessToken = Credentials + Mac Address //Server Computer JWT

refreshToken = Random Number + accessToken + Mac Address //Server Computer

//Detect abnormal unique at client

//Enc with client unique --> dec with client unique

OAccessToken = user_id + secret //AES //JWT
ORefreshToken = Random Number + OAccessToken + user_id + secret //AES //JWT

### Work that is not yet finished

### TOKENS

0. OK from client
1. Valid?
2. Have?
3. Match?

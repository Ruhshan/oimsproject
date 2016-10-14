from django.contrib.auth import logout
from django.contrib import messages
import datetime
from django.shortcuts import redirect

import myproject.settings

class SessionIdleTimeout:
    def process_request(self, request):
        if request.user.is_authenticated():
            current_datetime = datetime.datetime.now()
            if ('last_login' in request.session):
                last = (current_datetime - request.session['last_login']).seconds
                if last > settings.SESSION_IDLE_TIMEOUT:
                    logout(request, inventory/unloggedhome.html)
            else:
                request.session['last_login'] = current_datetime
        return None


# from datetime import datetime, timedelta
# from django.conf import settings
# from django.contrib import auth


# class AutoLogout:
#   def process_request(self, request):
#     if not request.user.is_authenticated() :
#       #Can't log out if not logged in
#       return

#     try:
#       if datetime.now() - request.session['last_touch'] > timedelta( 0, settings.AUTO_LOGOUT_DELAY * 60, 0):
#         auth.logout(request)
#         del request.session['last_touch']
#         return
#     except KeyError:
#       pass

#     request.session['last_touch'] = datetime.now()
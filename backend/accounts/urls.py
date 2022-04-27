from django.urls import path
from accounts.views import (
    AllUser,
    ClearToken,
    GetCSRFToken,
    ObtainToken,
    RegisteredUser,
    UserDetail,
    UserList,
)

urlpatterns = [
    path("csrf-cookie/", GetCSRFToken.as_view(), name="obtain_csrf"),
    path("login/", ObtainToken.as_view(), name="obtain_token"),
    path("register/", UserList.as_view(), name="create_user"),
    path("logout/", ClearToken.as_view(), name="logout_user"),
    path("activate-user/<int:pk>/", UserDetail.as_view(), name="activate_user"),
    path("get-user-info/", RegisteredUser.as_view(), name="get_user_info"),
    path("get-all-user/", AllUser.as_view(), name="get_all_user"),
]

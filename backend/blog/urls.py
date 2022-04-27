from blog.views import BlogDetail, BlogList
from django.urls import path

urlpatterns = [
    path('blog-post/', BlogList.as_view()),
    path('blog-post/<int:pk>/', BlogDetail.as_view()),
    # path("login/", ObtainToken.as_view(), name="obtain_token"),
    # path("register/", UserList.as_view(), name="create_user"),
    # path("activate-user/<int:pk>/", UserDetail.as_view(), name="activate_user"),
    # path("get-user-info/", RegisteredUser.as_view(), name="get_user"),
    # path("get-all-user/", AllUser.as_view(), name="get_user"),
]

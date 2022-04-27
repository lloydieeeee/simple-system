from rest_framework import permissions
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.clickjacking import xframe_options_deny
from django.views.decorators.cache import never_cache

from blog.models import Blog
from blog.serializers import BlogSerializer

# Create your views here.
class BlogList(APIView):
    def get(self, request, format=None):
        blog = Blog.objects.all()
        serializer = BlogSerializer(blog, many=True)
        return Response(serializer.data)

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    @method_decorator(xframe_options_deny)
    @method_decorator(never_cache)
    def post(self, request, format=None):
        data = {"title": request.data["title"], "artist": request.user.id}
        serializer = BlogSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_protect, name="dispatch")
@method_decorator(xframe_options_deny, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class BlogDetail(APIView):
    def get_object(self, pk):
        try:
            return Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        blog = self.get_object(pk)
        serializer = BlogSerializer(blog)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        blog = self.get_object(pk)
        serializer = BlogSerializer(blog, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        blog = self.get_object(pk)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.db import models
from accounts.models import UserAccount

# Create your models here.
class Blog(models.Model):
    artist = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_date = models.DateField(auto_now_add=True)

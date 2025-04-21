from django.db import models


class NewsCategoy(models.Model):
    name = models.CharField(max_length=100)

class News(models.Model):
    category = models.ForeignKey(NewsCategoy, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()


class NewsComment(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class NewsLetter(models.Model):
    email = models.CharField(max_length=100, unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
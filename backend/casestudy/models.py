from django.db import models



class CaseStudyCategory(models.Model):
    name = models.CharField(max_length=100)


class CaseStudy(models.Model):
    category = models.ForeignKey(CaseStudyCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()


class CaseStudyComment(models.Model):
    case_study = models.ForeignKey(CaseStudy, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
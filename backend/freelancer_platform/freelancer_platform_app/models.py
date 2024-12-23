from django.db import models


class WebThreeUser(models.Model):
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    wallet_address = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    image = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        default="https://placehold.co/150x150"
    )

    facebook = models.URLField(max_length=255, blank=True, null=True)
    twitter = models.URLField(max_length=255, blank=True, null=True)
    linkedin = models.URLField(max_length=255, blank=True, null=True)
    github = models.URLField(max_length=255, blank=True, null=True)
    instagram = models.URLField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username or "Anonymous"


class JobType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Job(models.Model):
    STATUS_CHOICES = [        
        ("NEW", "New"),
        ("PUSHED", "Pushed"),
        ("ACCEPTED", "Accepted"),
        ("COMPLETED", "Completed"),
        ("DISPUTED", "Disputed"),
        ("RESOLVED", "Resolved"),
    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    info = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True, default="https://placehold.co/150x150")
    client = models.ForeignKey(WebThreeUser, on_delete=models.CASCADE, related_name="client_jobs")
    freelancer = models.ForeignKey(
        WebThreeUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="freelancer_jobs"
    )
    amount = models.DecimalField(max_digits=40, decimal_places=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="NEW")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    transaction_create = models.CharField(max_length=255, blank=True, null=True)
    transaction_accept_job = models.CharField(max_length=255, blank=True, null=True)
    transaction_complete_job = models.CharField(max_length=255, blank=True, null=True)

    job_type = models.ForeignKey(
        JobType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jobs"
    )

    def __str__(self):
        return f"Job #{self.id} by {self.client.username}"


class Dispute(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="dispute")
    initiator = models.ForeignKey(
        WebThreeUser, on_delete=models.CASCADE, related_name="initiated_disputes"
    )
    resolved = models.BooleanField(default=False)
    resolved_in_favor_of_freelancer = models.BooleanField(null=True, blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dispute for Job #{self.job.id}"


class PlatformSettings(models.Model):
    key = models.CharField(max_length=255, unique=True)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.key}: {self.value}"

    @staticmethod
    def get_platform_fee():
        fee_setting = PlatformSettings.objects.filter(key="platform_fee").first()
        return float(fee_setting.value) if fee_setting else 2.0


class LastIndexCrawl(models.Model):
    key = models.CharField(max_length=255,default="crawl_onchain")
    start_at = models.CharField(max_length=255)
    value = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.value}"
    
class JobPick(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="picks")
    freelancer = models.ForeignKey(WebThreeUser, on_delete=models.CASCADE, related_name="picked_jobs")
    picked_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the job was picked

    def __str__(self):
        return f"Freelancer {self.freelancer.username} picked Job #{self.job.id}"


class ChatMessage(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="chat_messages")
    sender = models.ForeignKey(WebThreeUser, on_delete=models.CASCADE, related_name="sent_messages", null=True)
    receiver = models.ForeignKey(WebThreeUser, on_delete=models.CASCADE, related_name="received_messages", null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username} for Job #{self.job.id}"

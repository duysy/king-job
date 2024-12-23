from django.contrib import admin
from .models import WebThreeUser, Job, Dispute, LastIndexCrawl, PlatformSettings, JobType


@admin.register(WebThreeUser)
class WebThreeUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'wallet_address', 'is_active', 'date_joined',)
    search_fields = ('username', 'email', 'wallet_address',)
    list_filter = ('is_active', 'date_joined',)
    ordering = ('-date_joined',)


@admin.register(JobType)
class JobTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at',)
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'client', 'freelancer', 'title', 'amount', 'status', 'created_at',
    )
    search_fields = ('client__username', 'freelancer__username', 'title', 'id',)
    list_filter = ('status', 'created_at',)
    readonly_fields = ('transaction_create', 'transaction_accept_job', 'transaction_complete_job', 'created_at', 'updated_at',)
    ordering = ('-created_at',)


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'initiator', 'resolved', 'resolved_in_favor_of_freelancer', 'created_at',)
    search_fields = ('job__id', 'initiator__username',)
    list_filter = ('resolved', 'resolved_in_favor_of_freelancer', 'created_at',)
    readonly_fields = ('created_at', 'updated_at',)
    ordering = ('-created_at',)


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ('key', 'value',)
    search_fields = ('key', 'value',)
    readonly_fields = ('key',)
    ordering = ('key',)


@admin.register(LastIndexCrawl)
class LastIndexCrawlAdmin(admin.ModelAdmin):
    list_display = ('key', 'start_at', 'value', 'updated_at',)
    search_fields = ('key', 'start_at', 'value',)
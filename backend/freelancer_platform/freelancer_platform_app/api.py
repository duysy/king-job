import os
import uuid
from django.http import FileResponse
from ninja import NinjaAPI
from ninja.errors import HttpError
from django.conf import settings
from datetime import datetime, timedelta
import jwt
from .models import ChatMessage, WebThreeUser, Job, JobPick, JobType
from .schemas import (
    LoginResponseSchema,
    LoginSchema,
    UserInfoSchema,
    UserUpdateSchema,
    JobSchema,
    JobTypeSchema,
    CreateJobSchema,
    TopFreelancerSchema,
    UserInfoProfileSchema,
    ChatMessagePayloadSchema,
    PublicUserResumeSchema
)
from typing import Optional
from django.core.files.storage import default_storage
from ninja import File
from ninja.files import UploadedFile as NinjaUploadedFile
from django.db.models import Count
from ninja import Query
from django.db.models import Q
from django.db.models import Sum

api = NinjaAPI()
SECRET_KEY = settings.SECRET_KEY

# Utility Functions
def generate_jwt_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'wallet_address': user.wallet_address,
        'exp': datetime.utcnow() + timedelta(days=1),  # Token valid for 1 day
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def jwt_authentication(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HttpError(401, "Authorization header missing or invalid")

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = WebThreeUser.objects.get(id=payload['user_id'])
        request.user = user
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, WebThreeUser.DoesNotExist):
        raise HttpError(401, "Invalid or expired token")

# Authentication Endpoints
@api.post("/login", tags=["Authentication"], response=LoginResponseSchema)
def login(request, payload: LoginSchema):
    try:
        user, created = WebThreeUser.objects.get_or_create(
            wallet_address=payload.wallet_address
        )
        if created:
            # Assign a default username if not provided
            user.username = f"User_{payload.wallet_address}"
            user.is_active = True
            user.save()
        if not user.is_active:
            raise HttpError(403, "User account is disabled")
        token = generate_jwt_token(user)
        return LoginResponseSchema(
            token=token, username=user.username, wallet_address=user.wallet_address, image=user.image, name=user.name
        )
    except Exception as e:
        raise HttpError(400, str(e))

# User Management APIs
@api.get("/user/info", tags=["User Info"], response=UserInfoSchema)
def get_user_info(request):
    user = jwt_authentication(request)
    user_data = {
        "id": user.id,        
        "username": user.username,
        "wallet_address": user.wallet_address,
        "name": user.name,
        "image": user.image,
        "bio": user.bio,
        "facebook": user.facebook, 
        "twitter": user.twitter,
        "linkedin": user.linkedin,
        "github": user.github,
        "instagram": user.instagram, 

    }
    return UserInfoSchema(**user_data)

@api.put("/user/update", tags=["User Info"], response={200: str, 400: str})
def update_user(request, payload: UserUpdateSchema):
    user = jwt_authentication(request)
    try:
        if payload.name is not None:
            user.name = payload.name
        if payload.bio is not None:
            user.bio = payload.bio
        if payload.image is not None:
            user.image = payload.image
        if payload.facebook is not None:
            user.facebook = payload.facebook 
        if payload.twitter is not None:
            user.twitter = payload.twitter 
        if payload.linkedin is not None:
            user.linkedin = payload.linkedin 
        if payload.github is not None:
            user.github = payload.github 
        if payload.instagram is not None:
            user.instagram = payload.instagram 
        user.save()

        return 200, "User information updated successfully."
    except Exception as e:
        return 400, f"Error updating user information: {str(e)}"

# File Management
@api.post("/upload-file", tags=["File Management"])
def upload_file(request, file: NinjaUploadedFile = File(...)):
    DOMAIN_ROOT = "http://localhost:8000/api/read-file"
    DOMAIN_ROOT = "/api/read-file"
    try:
        # Generate a unique file name
        file_extension = os.path.splitext(file.name)[1]
        unique_file_name = f"{uuid.uuid4().hex}{file_extension}"

        file_name = default_storage.save(unique_file_name, file)
        file_url = f"{DOMAIN_ROOT}/{file_name}"

        return {"message": "File uploaded successfully", "file_name": file_name, "file_url": file_url}
    except Exception as e:
        raise HttpError(400, f"Error uploading file: {str(e)}")

@api.get("/read-file/{file_name}", tags=["File Management"])
def read_file(request, file_name: str):
    """
    Returns the actual file content by its name.
    """
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)
    if not default_storage.exists(file_path):
        raise HttpError(404, "File not found")

    try:
        file = default_storage.open(file_name, "rb")
        return FileResponse(file, as_attachment=True, filename=file_name)
    except Exception as e:
        raise HttpError(500, f"Error reading file: {str(e)}")

@api.get("/job-types", tags=["Jobs"], response=list[JobTypeSchema])
def list_job_types(request):
    job_types = JobType.objects.all().order_by('-created_at')
    return job_types

@api.post("/jobs", tags=["Jobs"], response=JobSchema)
def create_job(request, payload: CreateJobSchema):
    user = jwt_authentication(request)
    try:
        job_type = JobType.objects.get(id=payload.job_type)
    except JobType.DoesNotExist:
        raise HttpError(400, "Invalid job type provided")

    job = Job.objects.create(
        title=payload.title,
        info=payload.info,
        description=payload.description,
        image=payload.image or "https://placehold.co/150x150",
        amount=payload.amount,
        client=user,
        job_type=job_type
    )
    return job

@api.get("/jobs", tags=["Jobs"], response=list[JobSchema])
def get_jobs(
    request,
    job_type_id: Optional[int] = Query(None),
    min_amount: Optional[int] = Query(None),
    max_amount: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    jobs = Job.objects.select_related('job_type', 'client', 'freelancer')\
        .order_by("-created_at")

    # Apply filters only if they are provided
    filters = Q()
    
    if job_type_id is not None:
        filters &= Q(job_type_id=job_type_id)
    
    if min_amount is not None:
        filters &= Q(amount__gte=min_amount)
    
    if max_amount is not None:
        filters &= Q(amount__lte=max_amount)
    
    if status:
        filters &= Q(status=status)
    
    if search:
        search_filters = Q(title__icontains=search) | Q(description__icontains=search)
        filters &= search_filters
    
    if filters:
        jobs = jobs.filter(filters)

    return jobs

@api.get("/jobs/by-client", tags=["Jobs"], response=list[JobSchema])
def jobs_by_client(request):
    user = jwt_authentication(request)
    jobs = Job.objects.filter(client=user).order_by('-created_at')
    return jobs

@api.get("/jobs/by-freelancer", tags=["Jobs"], response=list[JobSchema])
def jobs_by_freelancer(request):
    user = jwt_authentication(request)
    try:
        assigned_jobs = Job.objects.filter(freelancer=user).order_by('-created_at')
        picked_jobs = Job.objects.filter(picks__freelancer=user).order_by('-created_at')
        jobs = assigned_jobs.union(picked_jobs).order_by('-created_at')
        return jobs
    except Exception as e:
        raise HttpError(500, f"Error fetching jobs: {str(e)}")


@api.get("/jobs/newest", tags=["Jobs"], response=list[JobSchema])
def newest_jobs(request):
    jobs = Job.objects.exclude(status="NEW").order_by('-created_at')[:6]
    return list(jobs)

@api.get("/top-freelancers", tags=["Jobs"], response=list[TopFreelancerSchema])
def top_freelancers(request):
    freelancers = (
        WebThreeUser.objects.filter(freelancer_jobs__status="COMPLETED")
        .annotate(completed_jobs_count=Count('freelancer_jobs'))
        .order_by('-completed_jobs_count')[:6]
    )

    result = []
    for f in freelancers:
        result.append({
            "id": f.id,
            "username": f.username,
            "name": f.name,
            "image": f.image,
            "wallet_address": f.wallet_address,
            "completed_jobs_count": f.completed_jobs_count
        })
    return result

@api.get("/jobs/{job_id}/chat", tags=["Chat"], response=list[dict])
def fetch_chat_messages(
    request,
    job_id: int,
    user_A: Optional[str] = Query(None),
    user_B: Optional[str] = Query(None),
):
    user = jwt_authentication(request)
    try:
        job = Job.objects.get(id=job_id)
        if job.client != user and not job.picks.filter(freelancer=user).exists():
            raise HttpError(403, "You do not have access to this chat")

        messages = ChatMessage.objects.filter(job=job).order_by("timestamp")
        
        if user_A and user_B:
            messages = messages.filter(
                Q(sender__wallet_address=user_A, receiver__wallet_address=user_B) |
                Q(sender__wallet_address=user_B, receiver__wallet_address=user_A)
            )

        return [
            {
                "id": message.id,
                "sender_address": message.sender.wallet_address,
                "sender_name": message.sender.name,
                "receiver_address": message.receiver.wallet_address,
                "receiver_name": message.receiver.name,
                "content": message.content,
                "timestamp": message.timestamp.isoformat(),
            }
            for message in messages
        ]
    except Job.DoesNotExist:
        raise HttpError(404, "Job not found")
    except Exception as e:
        raise HttpError(500, f"Error fetching chat messages: {str(e)}")

@api.post("/jobs/{job_id}/chat", tags=["Chat"], response={200: str, 403: str, 404: str})
def send_chat_message(request, job_id: int, payload: ChatMessagePayloadSchema):
    user = jwt_authentication(request)
    try:
        content = payload.content
        receiver_address = payload.receiver_address

        receiver_user = WebThreeUser.objects.get(wallet_address=receiver_address)
        job = Job.objects.get(id=job_id)
        if job.client != user and not job.picks.filter(freelancer=user).exists():
            raise HttpError(403, "You do not have access to this chat")

        ChatMessage.objects.create(sender=user, receiver=receiver_user, job=job, content=content)
        return 200, "Message sent successfully"
    except WebThreeUser.DoesNotExist:
        raise HttpError(404, "Receiver not found")
    except Job.DoesNotExist:
        raise HttpError(404, "Job not found")
    except Exception as e:
        raise HttpError(500, f"Error sending message: {str(e)}")

    
@api.get("/jobs/{job_id}", tags=["Jobs"], response=JobSchema)
def get_job_by_id(request, job_id: int):
    try:
        job = Job.objects.get(id=job_id)
        return job
    except Job.DoesNotExist:
        raise HttpError(404, "Job not found")

@api.get("/jobs/{job_id}/picks", tags=["Jobs"], response=list[UserInfoProfileSchema])
def get_freelancers_by_job_id(request, job_id: int):
    user = jwt_authentication(request)

    try:
        job = Job.objects.get(id=job_id, client=user)
        picks = job.picks.all()

        freelancers = [
            {
                "id": pick.freelancer.id,
                "username": pick.freelancer.username,
                "wallet_address": pick.freelancer.wallet_address,
                "name": pick.freelancer.name,
                "bio": pick.freelancer.bio,
                "image": pick.freelancer.image,
            }
            for pick in picks
        ]
        return freelancers

    except Job.DoesNotExist:
        raise HttpError(404, "Job not found or you do not have access to this job")
    except Exception as e:
        raise HttpError(500, f"Error fetching freelancers: {str(e)}")

@api.post("/jobs/{job_id}/pick", tags=["Jobs"], response={200: str, 400: str, 404: str})
def pick_job(request, job_id: int):
    user = jwt_authentication(request)
    try:
        job = Job.objects.get(id=job_id)
        if job.freelancer == user:
            raise HttpError(400, "You are already assigned to this job")
        existing_pick = JobPick.objects.filter(job=job, freelancer=user).first()
        if existing_pick:
            raise HttpError(400, "You have already picked this job")
        JobPick.objects.create(job=job, freelancer=user)
        return 200, f"You have successfully picked the job: {job.title}"
    except Job.DoesNotExist:
        raise HttpError(404, "Job not found")
    except Exception as e:
        raise HttpError(500, f"Error picking job: {str(e)}")

@api.get("/users/{user_wallet}/resume", tags=["Public Resume"], response=PublicUserResumeSchema)
def get_public_user_resume(request, user_wallet: str):
    try:
        user = WebThreeUser.objects.get(wallet_address=user_wallet)

        completed_projects = Job.objects.filter(
            freelancer=user,
            status="COMPLETED"
        ).order_by('-created_at')

        total_income = completed_projects.aggregate(total=Sum('amount'))['total'] or 0.0

        completed_projects_data = [
            {
                "id": project.id,
                "title": project.title,
                "amount": float(project.amount),
                "description": project.description,
                "completed_at": project.updated_at.isoformat(),
            }
            for project in completed_projects
        ]

        social_links = {
            "facebook": user.facebook,
            "twitter": user.twitter,
            "linkedin": user.linkedin,
            "github": user.github,
            "instagram": user.instagram,
        }

        return PublicUserResumeSchema(
            id=user.id,
            username=user.username,
            name=user.name,
            email=user.email,
            bio=user.bio,
            image=user.image,
            wallet_address=user.wallet_address,
            date_joined=user.date_joined.isoformat(),
            social_links=social_links,
            completed_projects=completed_projects_data,
            total_income=total_income
        )
    except WebThreeUser.DoesNotExist:
        raise HttpError(404, "User not found")
    except Exception as e:
        raise HttpError(500, f"Error fetching user resume: {str(e)}")

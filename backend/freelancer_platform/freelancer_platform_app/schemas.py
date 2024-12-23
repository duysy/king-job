from typing import Optional
from ninja import Schema
from decimal import Decimal
import datetime
from typing import List

class UserInfoSchema(Schema):
    id: int
    username: Optional[str]
    wallet_address: str
    name: Optional[str]
    bio: Optional[str]
    image: Optional[str]
    facebook: Optional[str]
    twitter: Optional[str]
    linkedin: Optional[str]
    github: Optional[str]
    instagram: Optional[str]

class UserInfoProfileSchema(Schema):
    id: int
    username: Optional[str]
    wallet_address: str
    name: Optional[str]
    bio: Optional[str]
    image: Optional[str]

class UserUpdateSchema(Schema):
    name: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    instagram: Optional[str] = None


class LoginSchema(Schema):
    wallet_address: str

class LoginResponseSchema(Schema):
    token: str
    username: str
    wallet_address: str
    image: Optional[str]
    name: Optional[str]

class JobTypeSchema(Schema):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

class WebThreeUserSimpleSchema(Schema):
    id: int
    username: Optional[str] = None
    wallet_address: str
    name: Optional[str] = None
    image: Optional[str] = None

class JobSchema(Schema):
    id: int
    title: str
    description: str
    info: Optional[str]
    image: Optional[str]
    amount: Decimal
    status: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    client: Optional[WebThreeUserSimpleSchema] = None
    freelancer: Optional[WebThreeUserSimpleSchema] = None
    job_type: Optional[JobTypeSchema] = None
    transaction_create : Optional[str] = None
    transaction_accept_job : Optional[str] = None
    transaction_complete_job : Optional[str]= None
    
class CreateJobSchema(Schema):
    title: str
    description: str
    info: Optional[str] = None
    amount: float
    job_type: int
    image: Optional[str] = None

class TopFreelancerSchema(Schema):
    id: int
    username: Optional[str]
    name: Optional[str]
    image: Optional[str]
    wallet_address: str
    completed_jobs_count: int

class ChatMessagePayloadSchema(Schema):
    receiver_address: str
    content: str


class CompletedProjectSchema(Schema):
    id: int
    title: str
    amount: float
    description: str
    completed_at: str

class PublicUserResumeSchema(Schema):
    id: int
    username: str
    name: Optional[str]
    email: Optional[str]
    bio: Optional[str]
    image: Optional[str]
    wallet_address: str
    date_joined: str
    social_links: dict
    completed_projects: List[CompletedProjectSchema]
    total_income: float
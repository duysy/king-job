# King Job Platform - Backend

## Project Overview

Django-powered backend for the King Job platform, providing robust API services, job management, and blockchain interaction.

## System Requirements

- Python 3.9+
- PostgreSQL 12+
- Docker (optional, but recommended)

## Setup and Installation

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/duysy/king-job.git
   cd backend/freelancer_platform
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Database Setup:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Create Superuser:
   ```bash
   python manage.py createsuperuser
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

6. Access the platform locally:
   ```
   http://localhost:8000
   ```

### Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t king-job-backend .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8000:8000 king-job-backend
   ```

## Key Features

- RESTful APIs for job and user management.
- Blockchain integration for transparent transactions.
- Admin dashboard for job approval and monitoring.

## Architecture

The backend serves as the core API provider and interacts directly with the PostgreSQL database and blockchain components.